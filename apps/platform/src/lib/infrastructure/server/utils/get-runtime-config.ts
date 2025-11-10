import { cache } from 'react';
import env from '../config/env';

/**
 * Gets runtime configuration values
 *
 * Cached per-request using React's cache() to avoid re-reading env vars
 * multiple times in the same request.
 *
 * Note: NEXT_PUBLIC_ vars are embedded at build time but can be overridden
 * at runtime in Docker/PM2 environments. The session check in layout already
 * forces dynamic rendering, so these values are read at request time.
 */
export const getRuntimeConfig = cache(() => {
    return {
        NEXT_PUBLIC_E_CLASS_RUNTIME: env.NEXT_PUBLIC_E_CLASS_RUNTIME,
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME,
        NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL,
        defaultTheme: env.DEFAULT_THEME,
    };
});
