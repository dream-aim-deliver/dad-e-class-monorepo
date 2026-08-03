import { describe, it, expect, vi, afterEach } from 'vitest';
import { createUsercentricsAdapter } from '../../src/lib/infrastructure/client/analytics/consent/usercentrics-adapter';
import {
    hasServiceConsent,
    DENIED_CONSENT,
    type TConsentState,
} from '../../src/lib/infrastructure/client/analytics/types';

/**
 * Per-service consent gating — the app's only consent question.
 *
 * The adapter used to also aggregate services into analytics / marketing /
 * preferences category flags. Those were a lossy summary (a category is true
 * when ANY service in it is consented) and existed only to feed Google Consent
 * Mode, which the app no longer writes to. They were removed in #705; these
 * tests pin the two production incidents that motivated the per-service model,
 * so neither can return via a different route.
 *
 * Measured on the live CMP: Google Analytics is filed under "marketing" and our
 * OpenTelemetry monitoring under "functional", with no statistics category at
 * all. So the dashboard's category assignment is not a safe proxy for anything —
 * which is why nothing here reads `category`, and why these fixtures still
 * carry deliberately misleading ones.
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
        // The over-collection bug: GA lives under "marketing", which the old
        // mapping turned into consent.analytics, which the old gate treated as
        // permission to start telemetry the user had explicitly refused.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: OTEL, category: 'functional', given: false },
        ]);

        expect(hasServiceConsent(consent, 'google analytics')).toBe(true);
        expect(hasServiceConsent(consent, 'opentelemetry')).toBe(false);
    });

    it('DOES enable OTel when the user accepted only the OpenTelemetry service', async () => {
        // The under-collection case: the user consented to this service
        // specifically, so it must run even though nothing else is granted.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: false },
            { name: OTEL, category: 'functional', given: true },
        ]);

        expect(hasServiceConsent(consent, 'google analytics')).toBe(false);
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
        // No services key at all (a read that never resolved).
        expect(hasServiceConsent({}, 'opentelemetry')).toBe(false);
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

    it('does NOT spread consent to other services sharing a category', async () => {
        // Measured on production via the CMP's granular "Save settings": a user
        // who accepted ONLY Google Analytics had ad_storage, ad_user_data and
        // ad_personalization granted (gcs=G111), because GA is filed under
        // "marketing" in this tenant's dashboard and alone flipped the whole
        // category. Nothing reads `category` any more, so a refused service
        // sharing a category with an accepted one stays refused.
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Google Ads', category: 'marketing', given: false },
            { name: 'Facebook Pixel', category: 'marketing', given: false },
        ]);

        expect(hasServiceConsent(consent, 'google analytics')).toBe(true);
        expect(hasServiceConsent(consent, 'google ads')).toBe(false);
        expect(hasServiceConsent(consent, 'facebook pixel')).toBe(false);
    });

    it('reports each accepted service independently', async () => {
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Google Ads', category: 'marketing', given: true },
        ]);

        expect(hasServiceConsent(consent, 'google analytics')).toBe(true);
        expect(hasServiceConsent(consent, 'google ads')).toBe(true);
    });

    it('exposes the full per-service map, and nothing else', async () => {
        const consent = await readConsent([
            { name: 'Google Analytics', category: 'marketing', given: true },
            { name: 'Sentry', category: 'functional', given: false },
            { name: OTEL, category: 'functional', given: true },
        ]);

        expect(consent.services).toEqual({
            'google analytics': true,
            sentry: false,
            [OTEL.toLowerCase()]: true,
        });
        // No category flags survive on the consent state. Exact-key assertion
        // rather than a per-key absence check, so any reintroduced aggregate
        // fails here.
        expect(Object.keys(consent)).toEqual(['services']);
    });
});
