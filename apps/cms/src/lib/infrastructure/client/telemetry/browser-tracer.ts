'use client';

import {
    WebTracerProvider,
    BatchSpanProcessor,
    SpanProcessor,
    ReadableSpan,
} from '@opentelemetry/sdk-trace-web';
import type { Span } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

/**
 * SpanProcessor that adds page.route and page.locale attributes to every span.
 * This ensures browser spans can be filtered by the current page in dashboards.
 */
class PageAttributeSpanProcessor implements SpanProcessor {
    onStart(span: Span): void {
        if (typeof window !== 'undefined') {
            const pageRoute = window.location.pathname;
            const pathSegments = pageRoute.split('/').filter(Boolean);
            const pageLocale = pathSegments[0] || 'en';

            span.setAttribute('page.route', pageRoute);
            span.setAttribute('page.locale', pageLocale);
        }
    }

    onEnd(_span: ReadableSpan): void {
        // No-op
    }

    shutdown(): Promise<void> {
        return Promise.resolve();
    }

    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
}

let initialized = false;

export interface BrowserTracerConfig {
    serviceName: string;
    otlpEndpoint: string;
    enabled: boolean;
    /**
     * URL patterns to propagate trace headers to (CORS).
     * Pass as strings - they will be converted to RegExp on the client side.
     * This is required because RegExp objects cannot be serialized from Server to Client Components.
     * Defaults to the otlpEndpoint if not provided.
     */
    propagateToUrls?: string[];
}

/**
 * Initializes the OpenTelemetry browser tracer for client-side tracing.
 *
 * This function sets up:
 * - WebTracerProvider with OTLP HTTP exporter
 * - FetchInstrumentation for automatic fetch/XHR tracing
 * - DocumentLoadInstrumentation for page load metrics
 * - ZoneContextManager for async context propagation
 * - W3CTraceContextPropagator for distributed tracing
 *
 * @param config - Configuration for the browser tracer
 *
 * @example
 * ```typescript
 * initBrowserTracer({
 *   serviceName: 'e-class-cms-browser',
 *   otlpEndpoint: 'http://localhost:4318',
 *   enabled: true,
 *   propagateToUrls: ['localhost:5173'],
 * });
 * ```
 */
export function initBrowserTracer(config: BrowserTracerConfig): void {
    // Guard: only initialize once, only in browser, only when enabled
    if (!config.enabled || initialized || typeof window === 'undefined') {
        return;
    }

    try {
        // Extract page route and locale from current URL
        const pageRoute = window.location.pathname;
        const pathSegments = pageRoute.split('/').filter(Boolean);
        const pageLocale = pathSegments[0] || 'en';

        // Create resource with service name and app identification attributes
        const resource = new Resource({
            [ATTR_SERVICE_NAME]: config.serviceName,
            'app.type': 'cms',
            'app.layer': 'browser',
            'page.route': pageRoute,
            'page.locale': pageLocale,
        });

        // Create tracer provider
        const provider = new WebTracerProvider({ resource });

        // Configure OTLP exporter
        const exporter = new OTLPTraceExporter({
            url: `${config.otlpEndpoint}/v1/traces`,
        });

        // Add page attribute processor first (runs before batch processor)
        // This ensures every span gets page.route and page.locale attributes
        provider.addSpanProcessor(new PageAttributeSpanProcessor());

        // Add batch processor for efficient export
        provider.addSpanProcessor(
            new BatchSpanProcessor(exporter, {
                maxQueueSize: 100,
                maxExportBatchSize: 10,
                scheduledDelayMillis: 500,
                exportTimeoutMillis: 30000,
            })
        );

        // Register provider with context manager and propagator
        provider.register({
            contextManager: new ZoneContextManager(),
            propagator: new W3CTraceContextPropagator(),
        });

        // Determine which URLs to propagate trace headers to
        // Convert string patterns to RegExp (strings come from Server Components which can't serialize RegExp)
        const propagateUrls: RegExp[] = config.propagateToUrls
            ? config.propagateToUrls.map((pattern) => new RegExp(pattern))
            : [
                  // Escape special regex characters in the endpoint URL
                  new RegExp(
                      config.otlpEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                  ),
              ];

        // Register instrumentations
        registerInstrumentations({
            instrumentations: [
                new FetchInstrumentation({
                    // Propagate trace headers to these URLs (CORS must allow)
                    propagateTraceHeaderCorsUrls: propagateUrls,
                    // Clear timing data to avoid memory leaks
                    clearTimingResources: true,
                }),
                new DocumentLoadInstrumentation(),
            ],
        });

        initialized = true;
        console.debug('[OTel Browser] Tracer initialized', {
            serviceName: config.serviceName,
            endpoint: config.otlpEndpoint,
        });
    } catch (error) {
        // Log but don't throw - tracing should not break the app
        console.warn('[OTel Browser] Failed to initialize tracer:', error);
    }
}

/**
 * Checks if the browser tracer has been initialized.
 */
export function isBrowserTracerInitialized(): boolean {
    return initialized;
}
