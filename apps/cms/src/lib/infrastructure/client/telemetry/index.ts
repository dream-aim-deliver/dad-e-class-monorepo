export { injectTraceContext, getTraceparentHeader } from './trace-context';
export {
    OTelBrowserProvider,
    type OTelBrowserProviderProps,
    type BrowserTracerConfig,
} from './OTelBrowserProvider';

// NOTE: browser-tracer.ts is NOT exported from this barrel.
// It is dynamically imported by OTelBrowserProvider to prevent
// @opentelemetry/context-zone from being loaded on the server,
// which would corrupt AsyncLocalStorage and break next-intl.
