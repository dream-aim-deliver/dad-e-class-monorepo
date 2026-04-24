'use client';

import { useEffect, ReactNode } from 'react';
import { useConsent } from '../analytics/consent/consent-provider';

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
    // Gate on the analytics consent category — mirrors Usercentrics' classification
    // of this DPS under Statistics / Analytics (Art. 6 para. 1 s. 1 lit. a GDPR).
    // Browser performance telemetry + fetch traces read the Performance Observer
    // API and transmit IP / URL / page.route off-device, which falls within
    // ePrivacy Art. 5(3) and is not "strictly necessary" for service delivery.
    const { consent } = useConsent();
    const hasConsent = consent.analytics;

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
