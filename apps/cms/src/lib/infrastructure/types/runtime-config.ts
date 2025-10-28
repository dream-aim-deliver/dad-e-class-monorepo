/**
 * Runtime Configuration Type
 *
 * This interface defines the shape of runtime configuration values that are:
 * 1. Read from environment variables at REQUEST TIME (not build time)
 * 2. Passed from server components to client components via RuntimeConfigProvider
 *
 * These values can vary between different deployments (dev, staging, prod) using the
 * same Docker image by changing environment variables at container startup.
 */
export interface RuntimeConfig {
    NEXT_PUBLIC_E_CLASS_RUNTIME: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: string;
}
