'use client';

// Lazy load OpenTelemetry API to prevent initialization side effects
let otelApi: typeof import('@opentelemetry/api') | null = null;

async function getOtelApi() {
    if (!otelApi) {
        try {
            otelApi = await import('@opentelemetry/api');
        } catch {
            // OTel not available
        }
    }
    return otelApi;
}

/**
 * Injects W3C trace context headers (traceparent, tracestate) into a headers object
 * for distributed tracing propagation.
 *
 * This function safely injects the current trace context from the active span
 * into the provided headers object. If OpenTelemetry is not initialized or
 * there is no active span, the function silently returns the original headers
 * without modification.
 *
 * @param headers - The headers object to inject trace context into
 * @returns The headers object with trace context headers added (if available)
 *
 * @example
 * ```typescript
 * const headers: Record<string, string> = {
 *   'Authorization': 'Bearer token',
 * };
 * injectTraceContext(headers);
 * // headers now includes 'traceparent' and optionally 'tracestate'
 * ```
 */
export function injectTraceContext(
    headers: Record<string, string>
): Record<string, string> {
    // Synchronous version - uses cached otelApi if available
    if (otelApi) {
        try {
            otelApi.propagation.inject(otelApi.context.active(), headers);
        } catch {
            // Silently fail - tracing should not break functionality
        }
    }
    return headers;
}

/**
 * Gets the traceparent header value from the current trace context.
 * Returns undefined if no active span or OpenTelemetry is not initialized.
 *
 * @returns The traceparent header value or undefined
 *
 * @example
 * ```typescript
 * const traceparent = getTraceparentHeader();
 * if (traceparent) {
 *   console.log('Current trace:', traceparent);
 * }
 * ```
 */
export function getTraceparentHeader(): string | undefined {
    if (!otelApi) {
        return undefined;
    }
    try {
        const carrier: Record<string, string> = {};
        otelApi.propagation.inject(otelApi.context.active(), carrier);
        return carrier['traceparent'];
    } catch {
        return undefined;
    }
}

// Initialize OTel API lazily when browser loads
if (typeof window !== 'undefined') {
    getOtelApi();
}
