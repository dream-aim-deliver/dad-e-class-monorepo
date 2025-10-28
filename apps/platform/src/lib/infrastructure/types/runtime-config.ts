/**
 * Runtime configuration interface
 * These values are read at request time, not build time
 *
 * In Next.js 15, calling connection() in a server component enables dynamic rendering,
 * which allows these values to be read from process.env at request time.
 */
export interface RuntimeConfig {
    NEXT_PUBLIC_E_CLASS_RUNTIME: string;
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: string;
}
