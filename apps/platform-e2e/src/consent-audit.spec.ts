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
