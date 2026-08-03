import { describe, it, expect, vi, afterEach } from 'vitest';
import { createUsercentricsAdapter } from '../../src/lib/infrastructure/client/analytics/consent/usercentrics-adapter';
import {
    hasServiceConsent,
    DENIED_CONSENT,
    type TConsentState,
} from '../../src/lib/infrastructure/client/analytics/types';

/**
 * Per-service consent gating.
 *
 * The three category flags (analytics / marketing / preferences) are a lossy
 * summary — a category is true when ANY service in it is consented. Gating one
 * specific first-party integration on a category therefore misfires. Measured
 * on the live CMP: Google Analytics is filed under "marketing", and our
 * OpenTelemetry monitoring under "functional", with no statistics category at
 * all. Gating OTel on `consent.analytics` meant a user who accepted GA but
 * REFUSED OpenTelemetry still got telemetry sent off-device.
 *
 * `hasServiceConsent()` gates on the service itself instead.
 */

interface TUcCmpFixture {
    name: string;
    category: string;
    given: boolean;
}

declare global {
    interface Window {
        __ucCmp?: unknown;
        UC_UI?: unknown;
    }
}

const OTEL = 'Platform Performance & Error Monitoring (OpenTelemetry)';

function installCmp(services: TUcCmpFixture[]): void {
    (window as Window).UC_UI = { isInitialized: () => true };
    (window as Window).__ucCmp = {
        getConsentDetails: () =>
            Promise.resolve({
                services: Object.fromEntries(
                    services.map((s, i) => [
                        `s${i}`,
                        {
                            name: s.name,
                            category: s.category,
                            essential: false,
                            consent: { given: s.given, type: 'EXPLICIT' },
                        },
                    ]),
                ),
            }),
    };
}

async function readConsent(services: TUcCmpFixture[]): Promise<TConsentState> {
    installCmp(services);
    const handler = vi.fn();
    createUsercentricsAdapter().onConsentChange(handler);
    await vi.waitFor(() =>
        expect(handler.mock.calls.at(-1)?.[0]?.services).toBeDefined(),
    );
    return handler.mock.calls.at(-1)![0] as TConsentState;
}

afterEach(() => {
    delete (window as Window).__ucCmp;
    delete (window as Window).UC_UI;
});

describe('per-service consent gating', () => {
    it('does NOT enable OTel when the user accepted Google Analytics but refused OpenTelemetry', async () => {
        // The over-collection bug: GA lives under "marketing" and forces
        // consent.analytics true via the GA special case, so the old
        // category-based gate started telemetry the user had refused.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: OTEL, category: 'functional', given: false },
        ]);

        expect(consent.analytics).toBe(true); // category flag says yes...
        expect(hasServiceConsent(consent, 'opentelemetry')).toBe(false); // ...service says no
    });

    it('DOES enable OTel when the user accepted only the OpenTelemetry service', async () => {
        // The under-collection case: the user consented to this service
        // specifically, so it must run even though no analytics category is set.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: false },
            { name: OTEL, category: 'functional', given: true },
        ]);

        expect(consent.analytics).toBe(false);
        expect(hasServiceConsent(consent, 'opentelemetry')).toBe(true);
    });

    it('does NOT enable OTel before any consent is given', async () => {
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: false },
            { name: OTEL, category: 'functional', given: false },
        ]);
        expect(hasServiceConsent(consent, 'opentelemetry')).toBe(false);
    });

    it('treats an absent consent record as NO consent', () => {
        // No services enumerated (noop adapter, failed read): absent is not
        // consent — telemetry must stay off rather than fall back to a category.
        expect(hasServiceConsent(DENIED_CONSENT, 'opentelemetry')).toBe(false);
        expect(hasServiceConsent({ ...DENIED_CONSENT, analytics: true }, 'opentelemetry')).toBe(false);
        // Service simply missing from an otherwise-populated payload.
        expect(
            hasServiceConsent(
                { ...DENIED_CONSENT, services: { 'google analytics': true } },
                'opentelemetry',
            ),
        ).toBe(false);
    });

    it('matches the service name case-insensitively on a fragment', async () => {
        const consent = await readConsent([
            { name: OTEL, category: 'functional', given: true },
        ]);
        expect(hasServiceConsent(consent, 'OpenTelemetry')).toBe(true);
        expect(hasServiceConsent(consent, 'error monitoring')).toBe(true);
        expect(hasServiceConsent(consent, 'sentry')).toBe(false);
    });

    it('does NOT grant advertising consent when the user accepted only Google Analytics', async () => {
        // Measured on production via the CMP's granular "Save settings": a user
        // who accepted ONLY Google Analytics had ad_storage, ad_user_data and
        // ad_personalization granted (gcs=G111), because GA is filed under
        // "marketing" in this tenant's dashboard and alone flipped the whole
        // category. GA is an analytics service regardless of where the
        // dashboard files it, so it must not imply advertising consent.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Google Ads', category: 'marketing', given: false },
            { name: 'Facebook Pixel', category: 'marketing', given: false },
        ]);

        expect(consent.analytics).toBe(true);
        expect(consent.marketing).toBe(false);
    });

    it('still grants marketing when a genuine marketing service is accepted', async () => {
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Google Ads', category: 'marketing', given: true },
        ]);

        expect(consent.analytics).toBe(true);
        expect(consent.marketing).toBe(true);
    });

    it('still exposes per-service consent alongside the category flags', async () => {
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Sentry', category: 'functional', given: false },
            { name: OTEL, category: 'functional', given: true },
        ]);

        expect(consent.services).toMatchObject({
            'google analytics': true,
            sentry: false,
            [OTEL.toLowerCase()]: true,
        });
        // Category flags remain intact for Google Consent Mode, which is
        // category-shaped by design. Marketing is false because the only
        // granted service under it is Google Analytics, which is excluded from
        // category aggregation — accepting GA must not grant ad consent.
        expect(consent.analytics).toBe(true);
        expect(consent.marketing).toBe(false);
        expect(consent.preferences).toBe(true);
    });
});
