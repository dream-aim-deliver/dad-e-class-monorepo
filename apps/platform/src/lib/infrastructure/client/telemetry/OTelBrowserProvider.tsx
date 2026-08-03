'use client';

import { useEffect, ReactNode } from 'react';
import { useConsent } from '../analytics/consent/consent-provider';
import { hasServiceConsent } from '../analytics/types';

/**
 * Name fragment identifying this integration's own service in the CMP.
 *
 * Matches the Usercentrics service "Platform Performance & Error Monitoring
 * (OpenTelemetry)". A fragment rather than the full label so a wording change
 * in the dashboard doesn't silently break the gate.
 */
const OTEL_CMP_SERVICE = 'opentelemetry';

/**
 * Configuration for the browser tracer.
 * Defined here to avoid importing from browser-tracer.ts which has side effects.
 */
export interface BrowserTracerConfig {
    serviceName: string;
    otlpEndpoint: string;
    enabled: boolean;
    /**
     * Platform instance identifier (e.g., 'eclass-dev', 'bewerber').
     * Used as the 'app.instance' resource attribute for filtering in dashboards.
     */
    appInstance?: string;
    /**
     * URL patterns to propagate trace headers to (CORS).
     * Pass as strings - they will be converted to RegExp on the client side.
     * This is required because RegExp objects cannot be serialized from Server to Client Components.
     * Defaults to the otlpEndpoint if not provided.
     */
    propagateToUrls?: string[];
}

export interface OTelBrowserProviderProps {
    children: ReactNode;
    /**
     * OpenTelemetry configuration. If not provided, browser tracing is disabled.
     */
    config?: BrowserTracerConfig;
}

/**
 * React provider component that initializes OpenTelemetry browser tracing.
 *
 * This provider should be placed high in the component tree, typically in the
 * root layout, to ensure tracing is initialized before any traced operations.
 *
 * IMPORTANT: This component uses dynamic import for browser-tracer.ts to prevent
 * @opentelemetry/context-zone from being loaded on the server, which would
 * corrupt AsyncLocalStorage and break next-intl.
 *
 * @example
 * ```tsx
 * // In your layout.tsx
 * <OTelBrowserProvider config={{
 *   serviceName: 'e-class-platform-browser',
 *   otlpEndpoint: 'http://localhost:4318',
 *   enabled: true,
 *   propagateToUrls: [/localhost:5173/],
 * }}>
 *   {children}
 * </OTelBrowserProvider>
 * ```
 */
export function OTelBrowserProvider({
    children,
    config,
}: OTelBrowserProviderProps) {
    // Gate on THIS integration's own CMP service, not on a consent category.
    //
    // Browser performance telemetry + fetch traces read the Performance
    // Observer API and transmit IP / URL / page.route off-device, which falls
    // within ePrivacy Art. 5(3) and is not "strictly necessary" for service
    // delivery — so it needs the user's consent for this specific service.
    //
    // This previously gated on `consent.analytics`, on the assumption that the
    // CMP filed this DPS under Statistics/Analytics. It does not: the service
    // sits under "functional", and there is no statistics category at all on
    // the account. The category proxy therefore misfired in both directions —
    // most importantly it STARTED telemetry for users who had explicitly
    // refused this service but accepted Google Analytics (which is filed under
    // marketing and forced `analytics` true). Those category flags no longer
    // exist — consent is reported per service only (#705).
    //
    // If the CMP reports no record for the service, hasServiceConsent() returns
    // false and telemetry stays off: absent consent is not consent.
    const { consent } = useConsent();
    const hasConsent = hasServiceConsent(consent, OTEL_CMP_SERVICE);

    useEffect(() => {
        if (!config || !config.enabled) return;

        if (hasConsent) {
            // Dynamic import — only loads in browser, never on server.
            // Prevents @opentelemetry/context-zone from corrupting AsyncLocalStorage.
            Promise.all([
                import('./browser-tracer'),
                import('./web-vitals'),
            ])
                .then(([{ initBrowserTracer }, { captureWebVitals }]) => {
                    initBrowserTracer(config);
                    captureWebVitals();
                })
                .catch((error) => {
                    console.warn('[OTel Browser] Failed to load tracer:', error);
                });
        } else {
            // Consent absent or revoked — disable instrumentations and shut
            // down the provider so no further spans are exported.
            import('./browser-tracer')
                .then(({ shutdownBrowserTracer }) => shutdownBrowserTracer())
                .catch(() => {
                    /* shutdown is best-effort; no user-facing action */
                });
        }
    }, [config, hasConsent]);

    return <>{children}</>;
}

export default OTelBrowserProvider;
