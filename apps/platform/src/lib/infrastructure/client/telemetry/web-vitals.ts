'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { trace, SpanStatusCode } from '@opentelemetry/api';

/**
 * Web Vitals metrics tracer.
 * Uses the 'web-vitals' scope to create spans for each Core Web Vital metric.
 */
const tracer = trace.getTracer('web-vitals');

/**
 * Creates an OpenTelemetry span for a Web Vital metric.
 *
 * The span duration is set to match the Web Vital value so that span metrics
 * (traces_span_metrics_duration_milliseconds) correctly reflect the measurement.
 *
 * @param metric - The Web Vital metric from the web-vitals library
 */
function reportWebVital(metric: Metric): void {
    // Calculate duration in milliseconds
    // For CLS, the value is unitless (not ms), so we multiply by 1000 to make it visible as ms
    // For all other metrics (LCP, FCP, INP, TTFB), the value is already in milliseconds
    const durationMs = metric.name === 'CLS' ? metric.value * 1000 : metric.value;

    // Use performance.now() which is what OpenTelemetry browser SDK uses internally
    // This ensures consistent time handling
    const endTime = performance.now();
    const startTime = endTime - durationMs;

    const span = tracer.startSpan(`web-vitals.${metric.name.toLowerCase()}`, {
        attributes: {
            'webvitals.name': metric.name,
            'webvitals.value': metric.value,
            'webvitals.rating': metric.rating,
            'webvitals.delta': metric.delta,
            'webvitals.id': metric.id,
            'webvitals.navigationType': metric.navigationType,
        },
        startTime: startTime,
    });

    // Set span status based on rating
    if (metric.rating === 'poor') {
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `Poor ${metric.name}: ${metric.value}`,
        });
    }

    span.end(endTime);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
        console.debug(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
        });
    }
}

/**
 * Initializes Web Vitals capture and reports metrics as OpenTelemetry spans.
 *
 * This function registers callbacks for all Core Web Vitals:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - INP (Interaction to Next Paint) - Responsiveness
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - FCP (First Contentful Paint) - Perceived load speed
 * - TTFB (Time to First Byte) - Server responsiveness
 *
 * Each metric is reported as a span with the following attributes:
 * - webvitals.name: The metric name (LCP, INP, CLS, FCP, TTFB)
 * - webvitals.value: The metric value in milliseconds (or unitless for CLS)
 * - webvitals.rating: 'good', 'needs-improvement', or 'poor'
 * - webvitals.delta: Change since last report (for CLS, INP)
 * - webvitals.id: Unique metric ID
 *
 * @example
 * ```typescript
 * // Call once after browser tracer is initialized
 * captureWebVitals();
 * ```
 */
export function captureWebVitals(): void {
    // Only run in browser
    if (typeof window === 'undefined') {
        return;
    }

    // Largest Contentful Paint - Loading performance
    // Good: < 2.5s, Needs improvement: 2.5s-4s, Poor: > 4s
    onLCP(reportWebVital);

    // Interaction to Next Paint - Responsiveness (replaces FID)
    // Good: < 200ms, Needs improvement: 200ms-500ms, Poor: > 500ms
    onINP(reportWebVital);

    // Cumulative Layout Shift - Visual stability
    // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
    onCLS(reportWebVital);

    // First Contentful Paint - Perceived load speed
    // Good: < 1.8s, Needs improvement: 1.8s-3s, Poor: > 3s
    onFCP(reportWebVital);

    // Time to First Byte - Server responsiveness
    // Good: < 800ms, Needs improvement: 800ms-1800ms, Poor: > 1800ms
    onTTFB(reportWebVital);

    console.debug('[Web Vitals] Capture initialized');
}
