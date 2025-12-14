/**
 * Next.js instrumentation hook for OpenTelemetry
 *
 * This function is called automatically by Next.js when the app starts.
 * It registers OpenTelemetry tracing when OTEL_ENABLED is set to 'true'.
 *
 * Features:
 * - Auto-instruments server actions and API routes
 * - Auto-instruments fetch requests
 * - Propagates trace context via W3C traceparent header
 * - Uses OTEL_EXPORTER_OTLP_ENDPOINT env var for export destination
 *
 * Resource attributes:
 * - app.type: 'platform' - identifies this as the platform app
 * - app.layer: 'server' - identifies server-side spans
 * - app.instance: runtime instance identifier (e.g., 'eclass-dev')
 *
 * Note: page.route is captured at the browser level via resource attributes.
 * Server-side spans already contain the route in the span name (e.g., "GET /en/workspace/courses").
 *
 * @see https://nextjs.org/docs/app/guides/open-telemetry
 * @see https://vercel.com/docs/observability/otel-overview
 */
export async function register() {
    // Only enable OpenTelemetry when explicitly enabled
    // Dynamic import to prevent loading OTel packages when disabled
    if (process.env.OTEL_ENABLED !== 'true') {
        return;
    }

    const { registerOTel } = await import('@vercel/otel');
    registerOTel({
        serviceName: process.env.OTEL_SERVICE_NAME || 'e-class-platform',
        attributes: {
            'app.type': 'platform',
            'app.layer': 'server',
            'app.instance': process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'default',
        },
    });
}
