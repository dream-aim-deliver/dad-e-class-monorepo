import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * LIVE CONSENT AUDIT — "premature consent grant" (Google Consent Mode).
 *
 * WHAT THIS PROVES
 * ----------------
 * A first-time visitor who has NOT touched the cookie banner must not have any
 * tracking consent granted. Concretely, before any interaction:
 *   - no non-essential service may report consent `given: true`
 *   - no `gtag('consent','update', ... 'granted')` may reach the dataLayer
 *   - every GA4 hit must carry `gcs=G100` (ad_storage + analytics_storage denied)
 *
 * These tests FAIL while the bug is present and PASS once it is fixed, so the
 * same suite serves as both the bug report and the acceptance check.
 *
 * SCOPE — BOTH PRODUCTION SITES
 * -----------------------------
 * justdoad.ai (Wix) and eclass.justdoad.ch (Next.js) share ONE Usercentrics
 * configuration (settings id `jnaPMX-WDaJ4Ig`), so both are affected and one
 * dashboard fix repairs both. Measured pre-click on 2026-07-18:
 *   justdoad.ai         G100 -> G101   (analytics granted, no click)
 *   eclass.justdoad.ch  G100 -> G111   (analytics + ads granted, no click)
 * The shared `G101` is the Usercentrics GTM template acting on implicit
 * consent; the extra `G111` on eclass is the app's own consent bridge
 * escalating it. This disproves the assumption that the Wix site was clean and
 * that the defect was specific to the Next.js integration.
 *
 * WHY THE BOT-EVASION BELOW IS LOAD-BEARING
 * -----------------------------------------
 * Usercentrics detects headless automation (it appends `isBot=true` to its
 * config request) and serves a PERMISSIVE configuration to bots: consent is
 * reported as not required and everything as accepted. A naive Playwright run
 * therefore measures the bot config, not what a real visitor gets — it can
 * report a false "all clear" on a genuinely broken site, or a false alarm on a
 * healthy one. `applyHumanFingerprint()` keeps the measurement honest; the
 * suite asserts the bot config was NOT served.
 */

const SITES = [
    { name: 'justdoad.ai (Wix)', url: 'https://www.justdoad.ai/' },
    { name: 'eclass.justdoad.ch (Next.js)', url: 'https://eclass.justdoad.ch/' },
] as const;

/** Time allowed for the CMP + GTM + GA4 to load and settle. */
const SETTLE_MS = 13_000;

const REAL_UA =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

/**
 * Advertising endpoints that must stay silent without marketing consent.
 *
 * Unlike GA4 — which legitimately keeps sending cookieless `gcs=G100` pings
 * under Consent Mode — these vendors have no consent-aware mode: a request to
 * them at all means tracking happened. Drawn from the services the CMP lists
 * for this account (Facebook Pixel, LinkedIn Insight Tag, TikTok, Google Ads /
 * DoubleClick).
 */
const AD_VENDOR_PATTERN =
    /(facebook\.(com|net)|fbcdn|linkedin\.com|licdn\.com|tiktok\.com|ttwstatic|doubleclick\.net|googleadservices\.com|google\.com\/(ads|pagead))/i;

interface TUcService {
    name: string;
    category: string;
    essential: boolean;
    given: boolean;
    /** 'EXPLICIT' = the user chose it; 'IMPLICIT' = pre-interaction default. */
    type: string | undefined;
}

interface TConsentUpdate {
    [signal: string]: string;
}

interface TGaHit {
    gcs: string | null;
    event: string | null;
}

interface TObservation {
    isBotConfig: boolean;
    settingsId: string | undefined;
    consentRequired: boolean | undefined;
    overallStatus: string | undefined;
    services: TUcService[];
    updates: TConsentUpdate[];
    gaHits: TGaHit[];
}

/**
 * Make the automated browser look like an ordinary one so Usercentrics serves
 * the real visitor configuration. See the file header.
 */
async function applyHumanFingerprint(context: BrowserContext): Promise<void> {
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
}

/** `gcs=G1<ad_storage><analytics_storage>`, 1 = granted, 0 = denied. */
function describeGcs(gcs: string | null): string {
    switch (gcs) {
        case 'G100':
            return 'G100 (both denied — correct before consent)';
        case 'G101':
            return 'G101 (analytics_storage GRANTED)';
        case 'G110':
            return 'G110 (ad_storage GRANTED)';
        case 'G111':
            return 'G111 (analytics + ad storage GRANTED)';
        default:
            return `${gcs ?? 'none'} (unrecognised)`;
    }
}

function isGrantedUpdate(update: TConsentUpdate): boolean {
    return Object.values(update).includes('granted');
}

/**
 * Load the site as a brand-new visitor and record the consent state WITHOUT
 * touching the banner.
 */
async function observeSite(page: Page, url: string): Promise<TObservation> {
    const gaHits: TGaHit[] = [];
    let isBotConfig = false;

    page.on('request', (request) => {
        const requestUrl = request.url();
        if (!requestUrl.includes('/g/collect')) return;
        try {
            const params = new URL(requestUrl).searchParams;
            gaHits.push({ gcs: params.get('gcs'), event: params.get('en') });
        } catch {
            /* non-parsable URL — ignore */
        }
    });

    page.on('response', (response) => {
        // Usercentrics flags automated browsers on its config request.
        if (/api\.service\.cmp\.usercentrics/.test(response.url()) &&
            response.url().includes('isBot=true')) {
            isBotConfig = true;
        }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // The banner is deliberately NOT interacted with.
    await page.waitForTimeout(SETTLE_MS);

    const state = await page.evaluate(async () => {
        const cmp = (
            window as unknown as {
                __ucCmp?: { getConsentDetails?: () => Promise<unknown> };
            }
        ).__ucCmp;
        const details = (await cmp?.getConsentDetails?.()) as
            | {
                  consent?: {
                      required?: boolean;
                      status?: string;
                      setting?: { id?: string };
                  };
                  services?: Record<
                      string,
                      {
                          name?: string;
                          category?: string;
                          essential?: boolean;
                          consent?: { given?: boolean; type?: string };
                      }
                  >;
              }
            | undefined;

        const services = Object.values(details?.services ?? {}).map((service) => ({
            name: service.name ?? '(unnamed)',
            category: service.category ?? '(none)',
            essential: !!service.essential,
            given: !!service.consent?.given,
            type: service.consent?.type,
        }));

        const layer =
            (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
        const updates: Record<string, string>[] = [];
        for (const entry of layer) {
            const args = Array.from((entry ?? []) as ArrayLike<unknown>);
            if (args[0] === 'consent' && args[1] === 'update') {
                updates.push(args[2] as Record<string, string>);
            }
        }

        return {
            settingsId: details?.consent?.setting?.id,
            consentRequired: details?.consent?.required,
            overallStatus: details?.consent?.status,
            services,
            updates,
        };
    });

    return { ...state, isBotConfig, gaHits };
}

/** Human-readable evidence block — this is what gets shared with the client. */
function report(siteName: string, observed: TObservation): void {
    const implicitlyGranted = observed.services.filter(
        (service) => !service.essential && service.given,
    );
    const grantedUpdates = observed.updates.filter(isGrantedUpdate);
    const leakyHits = observed.gaHits.filter(
        (hit) => hit.gcs !== null && hit.gcs !== 'G100',
    );

    console.log(`\n──────── ${siteName} ────────`);
    console.log(`Usercentrics settings id : ${observed.settingsId ?? 'unknown'}`);
    console.log(`consent required         : ${observed.consentRequired}`);
    console.log(`overall consent status   : ${observed.overallStatus}`);
    console.log(
        `\nNon-essential services granted BEFORE any click (${implicitlyGranted.length}):`,
    );
    for (const service of implicitlyGranted) {
        console.log(
            `   ✗ ${service.name}  [${service.category}]  type=${service.type}`,
        );
    }
    console.log(`\nGA4 hits and their Consent Mode signal:`);
    for (const hit of observed.gaHits) {
        const marker = hit.gcs === 'G100' ? '✓' : '✗';
        console.log(`   ${marker} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`);
    }
    console.log(
        `\nGranted consent updates pushed pre-click: ${grantedUpdates.length}`,
    );
    for (const update of grantedUpdates) {
        console.log(`   ✗ ${JSON.stringify(update)}`);
    }
    console.log(
        `\nSUMMARY: ${implicitlyGranted.length} implicit grants, ` +
            `${grantedUpdates.length} granted updates, ` +
            `${leakyHits.length} GA4 hits above G100\n`,
    );
}

/**
 * Every run is saved to `apps/platform-e2e/consent-audit-results/` so the
 * before/after evidence is durable and diffable.
 *
 *   AUDIT_LABEL=before-fix  pnpm exec playwright test -c .../consent-audit.config.ts
 *   AUDIT_LABEL=after-fix   pnpm exec playwright test -c .../consent-audit.config.ts
 */
const AUDIT_LABEL = process.env.AUDIT_LABEL || 'unlabelled';
// Playwright transpiles specs to CJS, so __dirname is the reliable anchor here
// (import.meta is unavailable) — keeps output next to the suite regardless of
// which directory the run was launched from.
const RESULTS_DIR = join(__dirname, '..', 'consent-audit-results');

const collected: { site: string; url: string; observed: TObservation }[] = [];

function verdictFor(observed: TObservation) {
    const implicitlyGranted = observed.services.filter(
        (service) => !service.essential && service.given,
    );
    const grantedUpdates = observed.updates.filter(isGrantedUpdate);
    const leakyHits = observed.gaHits.filter(
        (hit) => hit.gcs !== null && hit.gcs !== 'G100',
    );
    return {
        implicitlyGranted,
        grantedUpdates,
        leakyHits,
        pass:
            implicitlyGranted.length === 0 &&
            grantedUpdates.length === 0 &&
            leakyHits.length === 0,
    };
}

function writeArtifacts(): void {
    if (collected.length === 0) return;
    mkdirSync(RESULTS_DIR, { recursive: true });
    const takenAt = new Date().toISOString();
    const jsonPath = join(RESULTS_DIR, `consent-audit-${AUDIT_LABEL}.json`);

    // Playwright restarts its worker process after a test failure, which clears
    // this module's in-memory state — so each surviving site would otherwise
    // overwrite the previous one. Merge with whatever is already on disk for
    // this label, keyed by site, keeping the newest observation per site.
    const merged = new Map<string, (typeof collected)[number]>();
    try {
        const prior = JSON.parse(readFileSync(jsonPath, 'utf8')) as {
            label?: string;
            sites?: typeof collected;
        };
        // Only reuse entries from the same run label.
        if (prior.label === AUDIT_LABEL) {
            for (const entry of prior.sites ?? []) merged.set(entry.site, entry);
        }
    } catch {
        // No previous file for this label — first site of the run.
    }
    for (const entry of collected) merged.set(entry.site, entry);

    const sites = SITES.map((s) => merged.get(s.name)).filter(
        (entry): entry is (typeof collected)[number] => !!entry,
    );

    writeFileSync(
        jsonPath,
        JSON.stringify({ label: AUDIT_LABEL, takenAt, sites }, null, 2) + '\n',
    );

    const lines: string[] = [
        `# Consent Mode audit — \`${AUDIT_LABEL}\``,
        '',
        `Taken: ${takenAt}`,
        '',
        'A first-time visitor who has NOT touched the cookie banner must have no',
        'tracking consent: no non-essential service granted, no granted `gtag`',
        'consent update, and every GA4 hit at `gcs=G100`.',
        '',
    ];

    for (const { site, url, observed } of sites) {
        const v = verdictFor(observed);
        lines.push(
            `## ${site}`,
            '',
            `- URL: ${url}`,
            `- Usercentrics settings id: \`${observed.settingsId ?? 'unknown'}\``,
            `- consent required: \`${observed.consentRequired}\``,
            `- overall status: \`${observed.overallStatus}\``,
            `- **verdict: ${v.pass ? 'PASS ✅' : 'FAIL ❌'}**`,
            '',
            `### Non-essential services granted before any click (${v.implicitlyGranted.length})`,
            '',
        );
        if (v.implicitlyGranted.length === 0) {
            lines.push('_None — correct._', '');
        } else {
            lines.push('| Service | Category | Consent type |', '| --- | --- | --- |');
            for (const s of v.implicitlyGranted) {
                lines.push(`| ${s.name} | ${s.category} | ${s.type} |`);
            }
            lines.push('');
        }

        lines.push('### GA4 hits', '', '| Event | Consent Mode signal |', '| --- | --- |');
        for (const hit of observed.gaHits) {
            lines.push(
                `| ${hit.event ?? '(no event)'} | ${hit.gcs === 'G100' ? '✅' : '❌'} ${describeGcs(hit.gcs)} |`,
            );
        }
        lines.push('');

        lines.push(
            `### Granted consent updates pushed pre-click (${v.grantedUpdates.length})`,
            '',
        );
        if (v.grantedUpdates.length === 0) {
            lines.push('_None — correct._', '');
        } else {
            for (const u of v.grantedUpdates) {
                lines.push('- `' + JSON.stringify(u) + '`');
            }
            lines.push('');
        }
    }

    const ids = [...new Set(sites.map((c) => c.observed.settingsId))];
    lines.push(
        '## Shared configuration',
        '',
        ids.length === 1
            ? `Both sites load the same Usercentrics configuration \`${ids[0]}\`, so one dashboard change affects both.`
            : `Sites load different configurations: ${ids.join(', ')}.`,
        '',
    );

    writeFileSync(join(RESULTS_DIR, `consent-audit-${AUDIT_LABEL}.md`), lines.join('\n'));
    console.log(`\nSaved audit artifacts to ${RESULTS_DIR} (label: ${AUDIT_LABEL})`);
}

test.afterAll(() => {
    writeArtifacts();
});

test.describe('Consent Mode audit — no tracking consent before the user clicks', () => {
    for (const site of SITES) {
        test(`${site.name}: nothing is granted before the banner is touched`, async ({
            browser,
        }) => {
            // Fresh context = first-time visitor: no cookies, no stored consent.
            const context = await browser.newContext({
                locale: 'de-CH',
                timezoneId: 'Europe/Zurich',
                userAgent: REAL_UA,
            });
            await applyHumanFingerprint(context);
            const page = await context.newPage();

            try {
                const observed = await observeSite(page, site.url);
                report(site.name, observed);
                // Record BEFORE asserting so a failing run still writes evidence.
                collected.push({ site: site.name, url: site.url, observed });

                // Guard: if Usercentrics served its permissive bot config, the
                // measurement is meaningless — fail loudly rather than pass.
                expect(
                    observed.isBotConfig,
                    'Usercentrics served its bot configuration; the run does not ' +
                        'reflect a real visitor. Bot evasion needs updating.',
                ).toBe(false);

                expect(
                    observed.services.length,
                    'No Usercentrics services were read — the CMP did not load, ' +
                        'so nothing was actually verified.',
                ).toBeGreaterThan(0);

                // (1) No non-essential service may be granted pre-interaction.
                const implicitlyGranted = observed.services
                    .filter((service) => !service.essential && service.given)
                    .map((service) => `${service.name} [${service.category}]`);
                expect(
                    implicitlyGranted,
                    'These non-essential services report consent BEFORE the user ' +
                        'chose anything (Usercentrics Service Settings pre-grants them)',
                ).toEqual([]);

                // (2) No granted consent update may reach the dataLayer.
                const grantedUpdates = observed.updates.filter(isGrantedUpdate);
                expect(
                    grantedUpdates,
                    'A granted gtag consent update was pushed before any interaction',
                ).toEqual([]);

                // (3) Every GA4 hit must be fully denied.
                const leakyHits = observed.gaHits
                    .filter((hit) => hit.gcs !== null && hit.gcs !== 'G100')
                    .map((hit) => `${hit.event ?? '(no event)'}=${hit.gcs}`);
                expect(
                    leakyHits,
                    'GA4 hits fired with consent granted before any interaction',
                ).toEqual([]);
            } finally {
                await context.close();
            }
        });
    }

    /**
     * REVERSE DIRECTION — consent must actually turn ON after an explicit Accept.
     *
     * The tests above only prove nothing is granted BEFORE interaction. That
     * half can be satisfied by a CMP that never grants anything at all, which
     * would look "fixed" while silently recording no analytics. This test
     * closes that gap: after a real click on the banner's Accept button,
     * consent must flip to EXPLICIT and GA4 must report granted storage.
     *
     * The click happens in a throwaway, isolated browser context (fresh
     * profile, discarded at the end). No real user's consent is recorded.
     *
     * Selector note: the Usercentrics v3 banner renders inside the OPEN shadow
     * root of `#usercentrics-cmp-ui`; Playwright pierces open shadow roots with
     * CSS. `[data-action-type="accept"]` is used rather than button text so the
     * test does not break when the banner language changes.
     */
    for (const site of SITES) {
        test(`${site.name}: consent IS granted after an explicit Accept`, async ({
            browser,
        }) => {
            const context = await browser.newContext({
                locale: 'de-CH',
                timezoneId: 'Europe/Zurich',
                userAgent: REAL_UA,
            });
            await applyHumanFingerprint(context);
            const page = await context.newPage();

            const gaHits: TGaHit[] = [];
            page.on('request', (request) => {
                const requestUrl = request.url();
                if (!requestUrl.includes('/g/collect')) return;
                try {
                    const params = new URL(requestUrl).searchParams;
                    gaHits.push({
                        gcs: params.get('gcs'),
                        event: params.get('en'),
                    });
                } catch {
                    /* ignore */
                }
            });

            try {
                await page.goto(site.url, { waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(SETTLE_MS);

                const acceptButton = page.locator(
                    '#usercentrics-cmp-ui button[data-action-type="accept"]',
                );
                await expect(
                    acceptButton,
                    'The Usercentrics Accept button was not found — the banner did ' +
                        'not render, so consent could not be granted.',
                ).toBeVisible();

                const hitsBeforeClick = gaHits.length;
                await acceptButton.click();
                // Let the CMP persist the decision and GTM re-fire tags.
                await page.waitForTimeout(8_000);

                const after = await page.evaluate(async () => {
                    const cmp = (
                        window as unknown as {
                            __ucCmp?: {
                                getConsentDetails?: () => Promise<unknown>;
                            };
                        }
                    ).__ucCmp;
                    const details = (await cmp?.getConsentDetails?.()) as
                        | {
                              consent?: { status?: string };
                              services?: Record<
                                  string,
                                  {
                                      name?: string;
                                      essential?: boolean;
                                      consent?: {
                                          given?: boolean;
                                          type?: string;
                                      };
                                  }
                              >;
                          }
                        | undefined;
                    const services = Object.values(details?.services ?? {});
                    const ga = services.find((s) =>
                        (s.name ?? '').toLowerCase().startsWith('google analytics'),
                    );
                    return {
                        status: details?.consent?.status,
                        gaGiven: !!ga?.consent?.given,
                        gaType: ga?.consent?.type,
                        explicitCount: services.filter(
                            (s) => s.consent?.type === 'EXPLICIT',
                        ).length,
                    };
                });

                const postClickHits = gaHits.slice(hitsBeforeClick);
                const grantedHits = postClickHits.filter(
                    (hit) => hit.gcs !== null && hit.gcs !== 'G100',
                );

                console.log(`\n──────── ${site.name} — after explicit Accept ────────`);
                console.log(`overall status        : ${after.status}`);
                console.log(
                    `Google Analytics      : given=${after.gaGiven} type=${after.gaType}`,
                );
                console.log(`services now EXPLICIT : ${after.explicitCount}`);
                console.log(`GA4 hits after click  :`);
                for (const hit of postClickHits) {
                    console.log(
                        `   ${hit.gcs === 'G100' ? '✗' : '✓'} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                    );
                }

                // Consent must now be recorded as a real user decision.
                expect(
                    after.gaType,
                    'After clicking Accept, Google Analytics consent should be ' +
                        'recorded as EXPLICIT (a genuine user decision)',
                ).toBe('EXPLICIT');
                expect(
                    after.gaGiven,
                    'After clicking Accept, Google Analytics should be consented',
                ).toBe(true);

                // ...and analytics must actually be switched on downstream.
                expect(
                    grantedHits.length,
                    'After an explicit Accept, GA4 should fire with consent ' +
                        'granted (gcs above G100). Staying at G100 would mean ' +
                        'analytics is silently dead for consenting users.',
                ).toBeGreaterThan(0);
            } finally {
                await context.close();
            }
        });
    }

    /**
     * EXPLICIT REFUSAL — the mirror of the Accept test.
     *
     * The suite grew around two questions: "is anything granted before the
     * click?" and "does Accept work?". Neither covers the visitor who opens the
     * banner and says no — the one for whom the guarantee matters most. A
     * refusal has to be recorded as a real decision (EXPLICIT, given=false) and
     * must leave every downstream signal denied.
     *
     * `gcs=G100` after Deny is the CORRECT outcome, not a failure: GA4 still
     * sends cookieless pings under Consent Mode, and those carry G100. What
     * must not appear is any hit above G100.
     */
    for (const site of SITES) {
        test(`${site.name}: nothing is granted after an explicit Deny`, async ({
            browser,
        }) => {
            const context = await browser.newContext({
                locale: 'de-CH',
                timezoneId: 'Europe/Zurich',
                userAgent: REAL_UA,
            });
            await applyHumanFingerprint(context);
            const page = await context.newPage();

            const gaHits: TGaHit[] = [];
            page.on('request', (request) => {
                const requestUrl = request.url();
                if (!requestUrl.includes('/g/collect')) return;
                try {
                    const params = new URL(requestUrl).searchParams;
                    gaHits.push({
                        gcs: params.get('gcs'),
                        event: params.get('en'),
                    });
                } catch {
                    /* ignore */
                }
            });

            const adVendorHits: string[] = [];
            page.on('request', (request) => {
                if (AD_VENDOR_PATTERN.test(request.url())) {
                    adVendorHits.push(request.url());
                }
            });

            try {
                await page.goto(site.url, { waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(SETTLE_MS);

                const denyButton = page.locator(
                    '#usercentrics-cmp-ui button[data-action-type="deny"]',
                );
                await expect(
                    denyButton,
                    'The Usercentrics Deny button was not found — the banner did ' +
                        'not render, so consent could not be refused.',
                ).toBeVisible();

                const hitsBeforeClick = gaHits.length;
                const adHitsBeforeClick = adVendorHits.length;
                await denyButton.click();
                await page.waitForTimeout(8_000);

                const after = await page.evaluate(async () => {
                    const cmp = (
                        window as unknown as {
                            __ucCmp?: {
                                getConsentDetails?: () => Promise<unknown>;
                            };
                        }
                    ).__ucCmp;
                    const details = (await cmp?.getConsentDetails?.()) as
                        | {
                              consent?: { status?: string };
                              services?: Record<
                                  string,
                                  {
                                      name?: string;
                                      essential?: boolean;
                                      consent?: {
                                          given?: boolean;
                                          type?: string;
                                      };
                                  }
                              >;
                          }
                        | undefined;
                    const services = Object.values(details?.services ?? {});
                    return {
                        status: details?.consent?.status,
                        // Any non-essential service still reporting consent
                        // after an explicit refusal is a compliance failure.
                        stillGranted: services
                            .filter((s) => !s.essential && !!s.consent?.given)
                            .map((s) => s.name ?? '(unnamed)'),
                        explicitCount: services.filter(
                            (s) => s.consent?.type === 'EXPLICIT',
                        ).length,
                    };
                });

                const postClickHits = gaHits.slice(hitsBeforeClick);
                const leakyHits = postClickHits.filter(
                    (hit) => hit.gcs !== null && hit.gcs !== 'G100',
                );
                const postClickAdHits = adVendorHits.slice(adHitsBeforeClick);

                console.log(`\n──────── ${site.name} — after explicit Deny ────────`);
                console.log(`overall status            : ${after.status}`);
                console.log(`services now EXPLICIT     : ${after.explicitCount}`);
                console.log(
                    `non-essential still granted: ${after.stillGranted.length}`,
                );
                for (const name of after.stillGranted) {
                    console.log(`   ✗ ${name}`);
                }
                console.log(`GA4 hits after Deny       :`);
                for (const hit of postClickHits) {
                    console.log(
                        `   ${hit.gcs === 'G100' ? '✓' : '✗'} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                    );
                }
                console.log(
                    `advertising vendor requests: ${postClickAdHits.length}`,
                );
                for (const url of postClickAdHits) {
                    console.log(`   ✗ ${new URL(url).host}`);
                }

                // The refusal must be recorded as a genuine decision, not left
                // as a pre-interaction default.
                expect(
                    after.explicitCount,
                    'After clicking Deny, the CMP should record EXPLICIT ' +
                        'decisions — a refusal is a decision.',
                ).toBeGreaterThan(0);

                expect(
                    after.stillGranted,
                    'Non-essential services still report consent after the user ' +
                        'explicitly refused',
                ).toEqual([]);

                expect(
                    leakyHits,
                    'A GA4 hit carried consent above G100 after an explicit Deny',
                ).toEqual([]);

                expect(
                    postClickAdHits,
                    'An advertising vendor was contacted after an explicit Deny',
                ).toEqual([]);
            } finally {
                await context.close();
            }
        });
    }

    /**
     * GRANULAR CONSENT — accepting one service must not grant others.
     *
     * The two tests above only exercise Accept-All and Deny-All, which is why
     * both category-proxy bugs reached production unnoticed. This drives the
     * CMP's second layer, enables ONLY Google Analytics, and saves.
     *
     * Measured on eclass.justdoad.ch before the fix, with GA the sole accepted
     * service:
     *   - the app pushed ad_storage / ad_user_data / ad_personalization as
     *     GRANTED (gcs=G111) because GA is filed under "marketing"
     *   - OpenTelemetry traces were posted to the collector despite the service
     *     being explicitly refused
     * The Usercentrics GTM template got the same case right (all ad signals
     * denied), which is what identified the app as the source.
     *
     * Service ids are read from the CMP at runtime rather than hardcoded — they
     * differ per Usercentrics account and must not be baked into the repo.
     */
    test('eclass.justdoad.ch: accepting only Google Analytics grants nothing else', async ({
        browser,
    }) => {
        const context = await browser.newContext({
            locale: 'de-CH',
            timezoneId: 'Europe/Zurich',
            userAgent: REAL_UA,
        });
        await applyHumanFingerprint(context);
        const page = await context.newPage();

        const otelRequests: string[] = [];
        page.on('request', (request) => {
            if (/\/v1\/(traces|metrics|logs)/.test(request.url())) {
                otelRequests.push(request.url());
            }
        });

        try {
            await page.goto('https://eclass.justdoad.ch/', {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForTimeout(SETTLE_MS);

            // Resolve the CMP's own ids for the services we care about.
            const ids = await page.evaluate(async () => {
                const cmp = (
                    window as unknown as {
                        __ucCmp?: { getConsentDetails?: () => Promise<unknown> };
                    }
                ).__ucCmp;
                const details = (await cmp?.getConsentDetails?.()) as
                    | { services?: Record<string, { name?: string }> }
                    | undefined;
                const find = (fragment: string) =>
                    Object.entries(details?.services ?? {}).find(([, service]) =>
                        (service.name ?? '').toLowerCase().includes(fragment),
                    )?.[0];
                return {
                    ga: find('google analytics'),
                    otel: find('opentelemetry'),
                };
            });
            expect(ids.ga, 'Google Analytics service not found in CMP').toBeTruthy();
            expect(ids.otel, 'OpenTelemetry service not found in CMP').toBeTruthy();

            // Open the second layer, enable ONLY Google Analytics, save.
            await page.evaluate(() =>
                (
                    window as unknown as {
                        UC_UI?: { showSecondLayer?: () => void };
                    }
                ).UC_UI?.showSecondLayer?.(),
            );
            await page.waitForTimeout(3_000);
            await page.evaluate((gaId) => {
                const root = document.querySelector('#usercentrics-cmp-ui')
                    ?.shadowRoot;
                const toggle = root?.getElementById(`uc-service-${gaId}-toggle`);
                if (toggle?.getAttribute('aria-checked') !== 'true') {
                    (toggle as HTMLElement | null)?.click();
                }
            }, ids.ga);
            await page.waitForTimeout(800);

            const dataLayerMark = await page.evaluate(
                () =>
                    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [])
                        .length,
            );
            const otelMark = otelRequests.length;

            await page.locator('#usercentrics-cmp-ui button[data-action-type="save"]').click();
            await page.waitForTimeout(9_000);

            const result = await page.evaluate(async (mark) => {
                const cmp = (
                    window as unknown as {
                        __ucCmp?: { getConsentDetails?: () => Promise<unknown> };
                    }
                ).__ucCmp;
                const details = (await cmp?.getConsentDetails?.()) as
                    | {
                          services?: Record<
                              string,
                              { name?: string; consent?: { given?: boolean } }
                          >;
                      }
                    | undefined;
                const given = (fragment: string) =>
                    Object.values(details?.services ?? {}).some(
                        (service) =>
                            (service.name ?? '').toLowerCase().includes(fragment) &&
                            !!service.consent?.given,
                    );

                const layer =
                    (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
                const updates: Record<string, string>[] = [];
                for (const entry of layer.slice(mark)) {
                    const args = Array.from((entry ?? []) as ArrayLike<unknown>);
                    if (args[0] === 'consent' && args[1] === 'update') {
                        updates.push(args[2] as Record<string, string>);
                    }
                }
                return {
                    gaGiven: given('google analytics'),
                    otelGiven: given('opentelemetry'),
                    updates,
                };
            }, dataLayerMark);

            console.log('\n──────── granular save: only Google Analytics accepted ────────');
            console.log(`Google Analytics consented : ${result.gaGiven}`);
            console.log(`OpenTelemetry consented    : ${result.otelGiven}`);
            for (const update of result.updates) {
                console.log(`   consent update → ${JSON.stringify(update)}`);
            }
            console.log(
                `OTel collector posts after save: ${otelRequests.length - otelMark}`,
            );

            // Precondition: the click actually took effect.
            expect(result.gaGiven, 'Google Analytics should be consented').toBe(true);
            expect(result.otelGiven, 'OpenTelemetry should NOT be consented').toBe(false);

            // Accepting an analytics service must not grant advertising.
            const adGrants = result.updates.filter(
                (update) =>
                    update.ad_storage === 'granted' ||
                    update.ad_user_data === 'granted' ||
                    update.ad_personalization === 'granted',
            );
            expect(
                adGrants,
                'Advertising consent was granted although only Google Analytics was accepted',
            ).toEqual([]);

            // ...and must not start telemetry for a service that was refused.
            expect(
                otelRequests.length - otelMark,
                'OpenTelemetry traces were sent although the service was refused',
            ).toBe(0);
        } finally {
            await context.close();
        }
    });

    /**
     * SINGLE WRITER — only the Usercentrics GTM template may push Consent Mode.
     *
     * Acceptance criterion for #705. The app used to mirror the CMP's state into
     * `gtag('consent','update',...)` as well, so one accept produced two updates
     * to one global state. The two payloads were distinguishable by shape:
     *
     *   Usercentrics GTM template  4 keys: ad_storage, ad_user_data,
     *                                      ad_personalization, analytics_storage
     *   our app                    the same 4 PLUS personalization_storage
     *
     * `personalization_storage` is therefore a reliable fingerprint: the
     * template never emits it, so any update carrying it came from app code.
     * Asserting on shape rather than on a raw count is deliberate — GTM may
     * legitimately push more than one update (initialization, then the user's
     * choice), so a count would be brittle where the fingerprint is exact.
     *
     * NOTE: this necessarily runs against deployed code. It cannot pass before
     * the change is released, and it is the check to run immediately after.
     */
    test('eclass.justdoad.ch: only the Usercentrics template writes Consent Mode', async ({
        browser,
    }) => {
        const context = await browser.newContext({
            locale: 'de-CH',
            timezoneId: 'Europe/Zurich',
            userAgent: REAL_UA,
        });
        await applyHumanFingerprint(context);
        const page = await context.newPage();

        try {
            await page.goto('https://eclass.justdoad.ch/', {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForTimeout(SETTLE_MS);

            await page
                .locator('#usercentrics-cmp-ui button[data-action-type="accept"]')
                .click();
            await page.waitForTimeout(9_000);

            const updates = await page.evaluate(() => {
                const layer =
                    (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
                const found: Record<string, string>[] = [];
                for (const entry of layer) {
                    const args = Array.from((entry ?? []) as ArrayLike<unknown>);
                    if (args[0] === 'consent' && args[1] === 'update') {
                        found.push(args[2] as Record<string, string>);
                    }
                }
                return found;
            });

            console.log('\n──────── Consent Mode writers after Accept ────────');
            for (const update of updates) {
                const keys = Object.keys(update).sort();
                const source =
                    'personalization_storage' in update
                        ? 'app (5-key)'
                        : 'Usercentrics GTM template';
                console.log(`   [${source}] ${JSON.stringify(update)}`);
                console.log(`      keys: ${keys.join(', ')}`);
            }

            // Guard against a vacuous pass: if nothing writes Consent Mode at
            // all, the template is misconfigured and consent is not being
            // reported — a different, worse failure than two writers.
            expect(
                updates.length,
                'No consent update reached the dataLayer after Accept. The ' +
                    'Usercentrics GTM template is the only writer now, so this ' +
                    'means it is not firing.',
            ).toBeGreaterThan(0);

            const fromApp = updates.filter(
                (update) => 'personalization_storage' in update,
            );
            expect(
                fromApp,
                'A Consent Mode update carrying personalization_storage reached ' +
                    'the dataLayer. The Usercentrics template never emits that ' +
                    'key, so app code is writing Consent Mode again (#705).',
            ).toEqual([]);
        } finally {
            await context.close();
        }
    });

    /**
     * CUSTOM `track.*` EVENTS — the app's own dataLayer pushes.
     *
     * `track.ts` calls `sendGTMEvent(...)` unconditionally; it has never gated
     * on consent, and does not now. That was survivable while the app also
     * wrote Consent Mode signals. Since #705 it does not, so the ONLY thing
     * between a pre-consent `track.purchase()` and a vendor request is whether
     * the corresponding tags are consent-gated inside the GTM container —
     * configuration this repo cannot see or assert on statically.
     *
     * This drives that path for real: with the banner untouched, push the same
     * dataLayer events `track.*` pushes, then check nothing tracked.
     *
     * The events are pushed directly rather than by driving UI that happens to
     * call `track.*`. That is deliberate — it exercises the exact payload
     * `sendGTMEvent` produces without depending on a particular page having a
     * particular button, so the test does not rot when the UI changes.
     *
     * `gcs=G100` hits are expected and fine (cookieless pings). A hit above
     * G100, or any advertising-vendor request, means a tag fired for a user who
     * had consented to nothing.
     *
     * HONEST CAVEAT (measured 2026-08-03): this currently passes trivially.
     * `track.*` has no call sites in the app, and the GTM container has no tag
     * bound to these events — verified by the control at the end, which pushes
     * the same event AFTER accepting everything and still sees no GA4 hit. The
     * test is kept because it costs one page load and starts doing real work
     * the moment either of those changes, which is exactly when the risk
     * appears and when nobody would think to add it.
     */
    test('eclass.justdoad.ch: custom track events do not fire tags before consent', async ({
        browser,
    }) => {
        const context = await browser.newContext({
            locale: 'de-CH',
            timezoneId: 'Europe/Zurich',
            userAgent: REAL_UA,
        });
        await applyHumanFingerprint(context);
        const page = await context.newPage();

        const gaHits: TGaHit[] = [];
        const adVendorHits: string[] = [];
        page.on('request', (request) => {
            const requestUrl = request.url();
            if (requestUrl.includes('/g/collect')) {
                try {
                    const params = new URL(requestUrl).searchParams;
                    gaHits.push({
                        gcs: params.get('gcs'),
                        event: params.get('en'),
                    });
                } catch {
                    /* ignore */
                }
            }
            if (AD_VENDOR_PATTERN.test(requestUrl)) {
                adVendorHits.push(requestUrl);
            }
        });

        try {
            await page.goto('https://eclass.justdoad.ch/', {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForTimeout(SETTLE_MS);

            // Precondition: the banner is up and untouched.
            await expect(
                page.locator(
                    '#usercentrics-cmp-ui button[data-action-type="accept"]',
                ),
                'The banner did not render, so this test would be measuring a ' +
                    'page with no consent prompt at all.',
            ).toBeVisible();

            const gaBefore = gaHits.length;
            const adBefore = adVendorHits.length;

            // The payloads `track.viewItem` / `track.beginCheckout` /
            // `track.purchase` push. Ecommerce events are used because they are
            // the ones that would carry commercial value to an ad vendor.
            const pushed = await page.evaluate(() => {
                const layer = (
                    window as unknown as { dataLayer?: unknown[] }
                ).dataLayer;
                if (!Array.isArray(layer)) return 0;
                const item = {
                    item_id: 'audit-course',
                    item_name: 'Consent audit probe',
                    item_category: 'course',
                    price: 199,
                    quantity: 1,
                };
                layer.push({
                    event: 'view_item',
                    ecommerce: { currency: 'CHF', value: 199, items: [item] },
                });
                layer.push({
                    event: 'begin_checkout',
                    ecommerce: { currency: 'CHF', value: 199, items: [item] },
                });
                layer.push({
                    event: 'purchase',
                    ecommerce: {
                        transaction_id: 'audit-probe-tx',
                        currency: 'CHF',
                        value: 199,
                        items: [item],
                    },
                });
                return 3;
            });

            await page.waitForTimeout(8_000);

            const newGaHits = gaHits.slice(gaBefore);
            const leakyHits = newGaHits.filter(
                (hit) => hit.gcs !== null && hit.gcs !== 'G100',
            );
            const newAdHits = adVendorHits.slice(adBefore);

            console.log(
                '\n──────── custom track.* events pushed before consent ────────',
            );
            console.log(`events pushed              : ${pushed}`);
            console.log(`GA4 hits triggered         : ${newGaHits.length}`);
            for (const hit of newGaHits) {
                console.log(
                    `   ${hit.gcs === 'G100' ? '✓' : '✗'} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                );
            }
            console.log(`advertising vendor requests: ${newAdHits.length}`);
            for (const url of newAdHits) {
                console.log(`   ✗ ${new URL(url).host}`);
            }

            // Guard against a vacuous pass: if the dataLayer was missing, the
            // events never went anywhere and the assertions prove nothing.
            expect(
                pushed,
                'window.dataLayer was not an array — the track.* events were ' +
                    'never pushed, so this test proved nothing.',
            ).toBe(3);

            expect(
                leakyHits,
                'A custom track.* event produced a GA4 hit with consent above ' +
                    'G100 before the user consented to anything. The GTM tag ' +
                    'for this event is not consent-gated.',
            ).toEqual([]);

            expect(
                newAdHits,
                'A custom track.* event caused an advertising vendor request ' +
                    'before the user consented to anything.',
            ).toEqual([]);

            // ---- Diagnostic: is this test currently meaningful? --------------
            //
            // "Nothing fired" has two possible causes: the tags are correctly
            // consent-gated, or GTM has no tag bound to these events at all.
            // Measured 2026-08-03, it is the second — pushing the same event
            // AFTER accepting everything also produces no GA4 hit.
            //
            // So this test passes trivially today. It is kept as the guard for
            // when `track.*` is wired up (it has no call sites in the app yet)
            // and GTM gains matching tags; at that point the assertions above
            // start doing real work. Reported rather than asserted, so a known
            // and expected state does not leave the audit permanently red and
            // drown out the consent findings.
            await page
                .locator('#usercentrics-cmp-ui button[data-action-type="accept"]')
                .click();
            await page.waitForTimeout(8_000);

            const gaAfterConsent = gaHits.length;
            await page.evaluate(() => {
                const layer = (
                    window as unknown as { dataLayer?: unknown[] }
                ).dataLayer;
                if (!Array.isArray(layer)) return;
                layer.push({
                    event: 'view_item',
                    ecommerce: {
                        currency: 'CHF',
                        value: 199,
                        items: [
                            {
                                item_id: 'audit-course',
                                item_name: 'Consent audit probe',
                                item_category: 'course',
                                price: 199,
                                quantity: 1,
                            },
                        ],
                    },
                });
            });
            await page.waitForTimeout(8_000);

            const consentedHits = gaHits.slice(gaAfterConsent);
            console.log(
                `\nControl — same event after Accept: ${consentedHits.length} GA4 hit(s)`,
            );
            for (const hit of consentedHits) {
                console.log(
                    `   ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                );
            }
            if (consentedHits.length === 0) {
                console.log(
                    '   ⚠ No GTM tag consumes these events, so the pre-consent\n' +
                        '     assertions above passed trivially. They become\n' +
                        '     meaningful once track.* is wired up and GTM has\n' +
                        '     matching tags — until then this is a reminder, not\n' +
                        '     a pass.',
                );
            }
        } finally {
            await context.close();
        }
    });

    /**
     * REVOCATION — consent withdrawn mid-session must actually take effect.
     *
     * Accept, then reopen the CMP's second layer and refuse. Everything that
     * started on the strength of the acceptance has to stop: no GA4 hit above
     * G100 afterwards, and — the app-side half — no further OpenTelemetry
     * traces, since `OTelBrowserProvider` is supposed to shut the tracer down
     * when its service loses consent.
     *
     * Withdrawal is the direction that tends to go untested: the code path runs
     * only for users who change their mind, so a broken shutdown can sit in
     * production indefinitely without anyone noticing.
     */
    test('eclass.justdoad.ch: revoking consent mid-session stops tracking', async ({
        browser,
    }) => {
        const context = await browser.newContext({
            locale: 'de-CH',
            timezoneId: 'Europe/Zurich',
            userAgent: REAL_UA,
        });
        await applyHumanFingerprint(context);
        const page = await context.newPage();

        const gaHits: TGaHit[] = [];
        const otelRequests: string[] = [];
        page.on('request', (request) => {
            const requestUrl = request.url();
            if (requestUrl.includes('/g/collect')) {
                try {
                    const params = new URL(requestUrl).searchParams;
                    gaHits.push({
                        gcs: params.get('gcs'),
                        event: params.get('en'),
                    });
                } catch {
                    /* ignore */
                }
            }
            if (/\/v1\/(traces|metrics|logs)/.test(requestUrl)) {
                otelRequests.push(requestUrl);
            }
        });

        try {
            await page.goto('https://eclass.justdoad.ch/', {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForTimeout(SETTLE_MS);

            await page
                .locator('#usercentrics-cmp-ui button[data-action-type="accept"]')
                .click();
            await page.waitForTimeout(8_000);

            const grantedBeforeRevoke = gaHits.filter(
                (hit) => hit.gcs !== null && hit.gcs !== 'G100',
            ).length;

            // Reopen the CMP and refuse everything.
            await page.evaluate(() => {
                (
                    window as unknown as {
                        UC_UI?: { showSecondLayer?: () => void };
                    }
                ).UC_UI?.showSecondLayer?.();
            });
            await page.waitForTimeout(3_000);

            const denyButton = page.locator(
                '#usercentrics-cmp-ui button[data-action-type="deny"]',
            );
            await expect(
                denyButton,
                'The Deny control was not reachable from the second layer, so ' +
                    'consent could not be withdrawn.',
            ).toBeVisible();

            const gaMark = gaHits.length;
            const otelMark = otelRequests.length;
            await denyButton.click();
            await page.waitForTimeout(9_000);

            const after = await page.evaluate(async () => {
                const cmp = (
                    window as unknown as {
                        __ucCmp?: { getConsentDetails?: () => Promise<unknown> };
                    }
                ).__ucCmp;
                const details = (await cmp?.getConsentDetails?.()) as
                    | {
                          services?: Record<
                              string,
                              {
                                  name?: string;
                                  essential?: boolean;
                                  consent?: { given?: boolean };
                              }
                          >;
                      }
                    | undefined;
                return Object.values(details?.services ?? {})
                    .filter((s) => !s.essential && !!s.consent?.given)
                    .map((s) => s.name ?? '(unnamed)');
            });

            const postRevokeHits = gaHits.slice(gaMark);
            const leakyHits = postRevokeHits.filter(
                (hit) => hit.gcs !== null && hit.gcs !== 'G100',
            );
            const otelAfterRevoke = otelRequests.length - otelMark;

            console.log('\n──────── consent revoked mid-session ────────');
            console.log(`granted GA4 hits before revoke : ${grantedBeforeRevoke}`);
            console.log(
                `non-essential still granted    : ${after.length}`,
            );
            for (const name of after) {
                console.log(`   ✗ ${name}`);
            }
            console.log(`GA4 hits after revoke          :`);
            for (const hit of postRevokeHits) {
                console.log(
                    `   ${hit.gcs === 'G100' ? '✓' : '✗'} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                );
            }
            console.log(`OTel collector posts after revoke: ${otelAfterRevoke}`);

            // Guard against a vacuous pass: if the Accept never took effect,
            // there was nothing to revoke and the assertions are trivial.
            expect(
                grantedBeforeRevoke,
                'Consent never took effect before the revoke, so this test ' +
                    'would prove nothing about withdrawal.',
            ).toBeGreaterThan(0);

            expect(
                after,
                'Non-essential services still report consent after the user ' +
                    'withdrew it',
            ).toEqual([]);

            expect(
                leakyHits,
                'GA4 fired with consent granted after the user withdrew consent',
            ).toEqual([]);

            expect(
                otelAfterRevoke,
                'OpenTelemetry kept posting traces after consent was withdrawn ' +
                    '— the tracer did not shut down',
            ).toBe(0);
        } finally {
            await context.close();
        }
    });

    /**
     * RETURNING VISITOR — a stored decision must be restored, not re-asked.
     *
     * Every other test opens a fresh context, so none of them exercises consent
     * PERSISTENCE. That gap matters: on a return visit the CMP restores the
     * stored decision and fires `UC_UI_INITIALIZED` with no user interaction at
     * all, and the app has to honour it. Reading that state wrongly is exactly
     * the `gcs=G100` incident — consent granted, analytics silently dead —
     * which is the failure this pins.
     *
     * Same browser context throughout, so cookies and localStorage survive the
     * reload the way they do for a real returning visitor.
     */
    test('eclass.justdoad.ch: stored consent is restored on a return visit', async ({
        browser,
    }) => {
        const context = await browser.newContext({
            locale: 'de-CH',
            timezoneId: 'Europe/Zurich',
            userAgent: REAL_UA,
        });
        await applyHumanFingerprint(context);
        const page = await context.newPage();

        const gaHits: TGaHit[] = [];
        page.on('request', (request) => {
            const requestUrl = request.url();
            if (!requestUrl.includes('/g/collect')) return;
            try {
                const params = new URL(requestUrl).searchParams;
                gaHits.push({
                    gcs: params.get('gcs'),
                    event: params.get('en'),
                });
            } catch {
                /* ignore */
            }
        });

        try {
            await page.goto('https://eclass.justdoad.ch/', {
                waitUntil: 'domcontentloaded',
            });
            await page.waitForTimeout(SETTLE_MS);
            await page
                .locator('#usercentrics-cmp-ui button[data-action-type="accept"]')
                .click();
            await page.waitForTimeout(8_000);

            // Second visit, same profile, no interaction.
            const mark = gaHits.length;
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(SETTLE_MS);

            const restored = await page.evaluate(async () => {
                const cmp = (
                    window as unknown as {
                        __ucCmp?: { getConsentDetails?: () => Promise<unknown> };
                    }
                ).__ucCmp;
                const details = (await cmp?.getConsentDetails?.()) as
                    | {
                          consent?: { status?: string };
                          services?: Record<
                              string,
                              {
                                  name?: string;
                                  consent?: {
                                      given?: boolean;
                                      type?: string;
                                  };
                              }
                          >;
                      }
                    | undefined;
                const ga = Object.values(details?.services ?? {}).find((s) =>
                    (s.name ?? '').toLowerCase().startsWith('google analytics'),
                );
                return {
                    status: details?.consent?.status,
                    gaGiven: !!ga?.consent?.given,
                    gaType: ga?.consent?.type,
                };
            });

            const bannerVisible = await page
                .locator('#usercentrics-cmp-ui button[data-action-type="accept"]')
                .isVisible()
                .catch(() => false);

            const reloadHits = gaHits.slice(mark);
            const grantedHits = reloadHits.filter(
                (hit) => hit.gcs !== null && hit.gcs !== 'G100',
            );

            console.log('\n──────── return visit (stored consent) ────────');
            console.log(`overall status       : ${restored.status}`);
            console.log(
                `Google Analytics     : given=${restored.gaGiven} type=${restored.gaType}`,
            );
            console.log(`banner shown again   : ${bannerVisible}`);
            console.log(`GA4 hits after reload:`);
            for (const hit of reloadHits) {
                console.log(
                    `   ${hit.gcs === 'G100' ? '✗' : '✓'} ${hit.event ?? '(no event)'} → ${describeGcs(hit.gcs)}`,
                );
            }

            // The stored decision is a real prior choice and must stay EXPLICIT
            // — if it came back as IMPLICIT, the app would (correctly) refuse to
            // act on it and analytics would silently die for returning users.
            expect(
                restored.gaType,
                'Stored consent came back as something other than EXPLICIT on a ' +
                    'return visit. The app deliberately ignores non-EXPLICIT ' +
                    'consent, so analytics would be silently dead for every ' +
                    'returning visitor.',
            ).toBe('EXPLICIT');
            expect(
                restored.gaGiven,
                'Stored consent was not restored on the return visit',
            ).toBe(true);

            expect(
                bannerVisible,
                'The banner was shown again to a visitor who had already ' +
                    'decided — the stored decision was not honoured.',
            ).toBe(false);

            expect(
                grantedHits.length,
                'GA4 stayed at G100 on a return visit despite stored consent — ' +
                    'analytics is silently dead for returning users (the ' +
                    'original gcs=G100 incident).',
            ).toBeGreaterThan(0);
        } finally {
            await context.close();
        }
    });

    test('both sites share one Usercentrics configuration', async ({ browser }) => {
        // Documents WHY one dashboard change fixes both sites — and why neither
        // can be fixed in isolation.
        const seen: Record<string, string | undefined> = {};

        for (const site of SITES) {
            const context = await browser.newContext({
                locale: 'de-CH',
                timezoneId: 'Europe/Zurich',
                userAgent: REAL_UA,
            });
            await applyHumanFingerprint(context);
            const page = await context.newPage();
            try {
                const observed = await observeSite(page, site.url);
                seen[site.name] = observed.settingsId;
            } finally {
                await context.close();
            }
        }

        console.log('\nUsercentrics settings id per site:');
        for (const [name, id] of Object.entries(seen)) {
            console.log(`   ${name}: ${id}`);
        }

        const ids = Object.values(seen);
        expect(ids.every((id) => !!id)).toBe(true);
        expect(
            new Set(ids).size,
            'Both sites are expected to share one Usercentrics configuration',
        ).toBe(1);
    });
});
