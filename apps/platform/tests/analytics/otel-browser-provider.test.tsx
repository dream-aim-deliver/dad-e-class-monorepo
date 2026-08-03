import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

// vi.hoisted: vi.mock factories are hoisted above module-level consts, so the
// spies must be created in a hoisted block to be initialised when a factory
// runs. Referencing plain consts here silently yields a spy that never records.
const mocks = vi.hoisted(() => ({
    initBrowserTracer: vi.fn(),
    shutdownBrowserTracer: vi.fn(() => Promise.resolve()),
    captureWebVitals: vi.fn(),
}));

vi.mock(
    '../../src/lib/infrastructure/client/telemetry/browser-tracer',
    () => ({
        initBrowserTracer: mocks.initBrowserTracer,
        shutdownBrowserTracer: mocks.shutdownBrowserTracer,
    }),
);
vi.mock('../../src/lib/infrastructure/client/telemetry/web-vitals', () => ({
    captureWebVitals: mocks.captureWebVitals,
}));

const { initBrowserTracer, shutdownBrowserTracer, captureWebVitals } = mocks;

/**
 * "Telemetry started" is asserted via captureWebVitals rather than
 * initBrowserTracer. Both are invoked on consecutive lines of the same grant
 * branch, so either proves the branch ran, but initBrowserTracer is not
 * observable through this mock: under Vitest's dynamic-import interop the
 * component's destructured binding does not resolve to the spy, while
 * captureWebVitals and shutdownBrowserTracer both do. Asserting on a spy that
 * silently never records would make these tests vacuous.
 */

import { OTelBrowserProvider } from '../../src/lib/infrastructure/client/telemetry/OTelBrowserProvider';
import { ConsentProvider } from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import type { TConsentAdapter } from '../../src/lib/infrastructure/client/analytics/consent/consent-adapter';
import type { TConsentState } from '../../src/lib/infrastructure/client/analytics/types';

/**
 * Direct coverage for the component that turns consent into telemetry.
 *
 * The consent-state shape is covered in service-consent-gating.test.ts; what is
 * tested here is the effect itself — that OTelBrowserProvider starts the tracer
 * only when the user consented to THIS service, and shuts it down otherwise.
 *
 * The regression that motivated it: gating on the `analytics` category started
 * telemetry for users who accepted Google Analytics while explicitly refusing
 * the OpenTelemetry service.
 */

const OTEL_SERVICE = 'platform performance & error monitoring (opentelemetry)';

const CONFIG = {
    serviceName: 'test-browser',
    otlpEndpoint: 'https://collector.example.com',
    enabled: true,
};

/** Adapter that emits a fixed state, then lets the test push new states. */
function controllableAdapter(initial: TConsentState) {
    let emit: ((state: TConsentState) => void) | undefined;
    const adapter: TConsentAdapter = {
        init: () => undefined,
        onConsentChange: (handler) => {
            emit = handler;
            handler(initial);
            return () => {
                emit = undefined;
            };
        },
        showBanner: () => undefined,
    };
    return { adapter, push: (state: TConsentState) => emit?.(state) };
}

function state(overrides: Partial<TConsentState> = {}): TConsentState {
    return {
        analytics: false,
        marketing: false,
        preferences: false,
        ...overrides,
    };
}

function renderWith(adapter: TConsentAdapter) {
    return render(
        <ConsentProvider adapter={adapter}>
            <OTelBrowserProvider config={CONFIG}>
                <span>child</span>
            </OTelBrowserProvider>
        </ConsentProvider>,
    );
}

beforeEach(() => {
    initBrowserTracer.mockClear();
    shutdownBrowserTracer.mockClear();
    captureWebVitals.mockClear();
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('OTelBrowserProvider consent gating', () => {
    it('starts telemetry when the OpenTelemetry service is consented', async () => {
        const { adapter } = controllableAdapter(
            state({ services: { [OTEL_SERVICE]: true } }),
        );
        renderWith(adapter);

        // Note: a shutdown call is expected before this — the provider mounts
        // with the all-denied default and only then receives the real state.
        await waitFor(() => expect(captureWebVitals).toHaveBeenCalledTimes(1));
    });

    it('does NOT start telemetry when the user accepted analytics but refused the OTel service', async () => {
        // The over-collection regression: the analytics category is granted
        // (Google Analytics is filed under marketing and forces it true), but
        // this specific service was refused.
        const { adapter } = controllableAdapter(
            state({
                analytics: true,
                marketing: true,
                services: {
                    'google analytics': true,
                    [OTEL_SERVICE]: false,
                },
            }),
        );
        renderWith(adapter);

        await waitFor(() =>
            expect(shutdownBrowserTracer).toHaveBeenCalled(),
        );
        expect(captureWebVitals).not.toHaveBeenCalled();
    });

    it('starts telemetry even when no analytics category is granted, if the service itself is', async () => {
        // The under-collection regression, mirrored.
        const { adapter } = controllableAdapter(
            state({ analytics: false, services: { [OTEL_SERVICE]: true } }),
        );
        renderWith(adapter);

        await waitFor(() => expect(captureWebVitals).toHaveBeenCalledTimes(1));
    });

    it('shuts the tracer down when consent is revoked mid-session', async () => {
        const { adapter, push } = controllableAdapter(
            state({ services: { [OTEL_SERVICE]: true } }),
        );
        renderWith(adapter);
        await waitFor(() => expect(captureWebVitals).toHaveBeenCalledTimes(1));

        push(state({ services: { [OTEL_SERVICE]: false } }));

        await waitFor(() => expect(shutdownBrowserTracer).toHaveBeenCalled());
    });

    it('treats an absent consent record as no consent', async () => {
        // No services enumerated at all — must not fall back to a category.
        const { adapter } = controllableAdapter(state({ analytics: true }));
        renderWith(adapter);

        await waitFor(() => expect(shutdownBrowserTracer).toHaveBeenCalled());
        expect(captureWebVitals).not.toHaveBeenCalled();
    });

    it('does nothing at all when telemetry is disabled by config', async () => {
        const { adapter } = controllableAdapter(
            state({ services: { [OTEL_SERVICE]: true } }),
        );
        render(
            <ConsentProvider adapter={adapter}>
                <OTelBrowserProvider config={{ ...CONFIG, enabled: false }}>
                    <span>child</span>
                </OTelBrowserProvider>
            </ConsentProvider>,
        );

        await Promise.resolve();
        expect(captureWebVitals).not.toHaveBeenCalled();
        expect(shutdownBrowserTracer).not.toHaveBeenCalled();
    });
});
