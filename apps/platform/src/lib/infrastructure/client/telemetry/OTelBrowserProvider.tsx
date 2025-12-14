'use client';

import { useEffect, ReactNode } from 'react';

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
    useEffect(() => {
        if (config && config.enabled) {
            // Dynamic import - only loads in browser, never on server
            // This prevents @opentelemetry/context-zone from corrupting AsyncLocalStorage
            Promise.all([
                import('./browser-tracer'),
                import('./web-vitals'),
            ])
                .then(([{ initBrowserTracer }, { captureWebVitals }]) => {
                    // Initialize the browser tracer first
                    initBrowserTracer(config);
                    // Then capture Web Vitals (LCP, INP, CLS, FCP, TTFB)
                    captureWebVitals();
                })
                .catch((error) => {
                    console.warn('[OTel Browser] Failed to load tracer:', error);
                });
        }
    }, [config]);

    return <>{children}</>;
}

export default OTelBrowserProvider;
