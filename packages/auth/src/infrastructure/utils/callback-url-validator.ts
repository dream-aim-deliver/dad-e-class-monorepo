/**
 * Validates and sanitizes callback URLs to prevent open redirect vulnerabilities
 *
 * Security rules:
 * 1. Must be a relative URL (starts with /)
 * 2. Cannot be a double-slash protocol-relative URL (//example.com)
 * 3. Cannot be an auth route (prevents redirect loops)
 * 4. Must be a valid URL format
 */

const AUTH_ROUTES = [
    '/auth/login',
    '/auth/logout',
    '/auth/error',
    '/auth/signin',
    '/auth/signout',
    '/auth/callback',
    '/api/auth',
];

export interface ValidateCallbackUrlOptions {
    /**
     * Default URL to return if validation fails
     * @default '/'
     */
    defaultUrl?: string;

    /**
     * Additional forbidden paths to check
     * @default []
     */
    forbiddenPaths?: string[];

    /**
     * Whether to allow query parameters in the callback URL
     * @default true
     */
    allowQueryParams?: boolean;
}

/**
 * Validates a callback URL and returns a safe version or the default URL
 *
 * @param callbackUrl - The callback URL to validate (can be null/undefined)
 * @param options - Validation options
 * @returns A safe callback URL or the default URL
 *
 * @example
 * validateCallbackUrl('/dashboard') // '/dashboard'
 * validateCallbackUrl('https://evil.com') // '/' (default)
 * validateCallbackUrl('/auth/login') // '/' (default, prevents loop)
 * validateCallbackUrl(null) // '/' (default)
 */
export function validateCallbackUrl(
    callbackUrl: string | null | undefined,
    options: ValidateCallbackUrlOptions = {}
): string {
    const {
        defaultUrl = '/',
        forbiddenPaths = [],
        allowQueryParams = true,
    } = options;

    // Handle null/undefined/empty
    if (!callbackUrl || typeof callbackUrl !== 'string' || callbackUrl.trim() === '') {
        return defaultUrl;
    }

    const trimmedUrl = callbackUrl.trim();

    // Must start with / (relative URL)
    if (!trimmedUrl.startsWith('/')) {
        console.warn('[Auth] Callback URL rejected: Not a relative URL:', trimmedUrl);
        return defaultUrl;
    }

    // Reject protocol-relative URLs (//example.com)
    if (trimmedUrl.startsWith('//')) {
        console.warn('[Auth] Callback URL rejected: Protocol-relative URL:', trimmedUrl);
        return defaultUrl;
    }

    // Extract the pathname (remove query params and hash)
    let pathname: string;
    try {
        // Parse as URL with a dummy base to extract pathname
        const url = new URL(trimmedUrl, 'http://dummy.local');
        pathname = url.pathname;

        // Check if query params are allowed
        if (!allowQueryParams && url.search) {
            console.warn('[Auth] Callback URL rejected: Query params not allowed:', trimmedUrl);
            return defaultUrl;
        }
    } catch (error) {
        console.warn('[Auth] Callback URL rejected: Invalid URL format:', trimmedUrl, error);
        return defaultUrl;
    }

    // Check if it's an auth route (prevents redirect loops)
    const isAuthRoute = AUTH_ROUTES.some(route => {
        // Check exact match or if pathname starts with route
        return pathname === route || pathname.startsWith(`${route}/`);
    });

    if (isAuthRoute) {
        console.warn('[Auth] Callback URL rejected: Auth route (prevents loop):', pathname);
        return defaultUrl;
    }

    // Check forbidden paths
    const isForbidden = forbiddenPaths.some(route => {
        return pathname === route || pathname.startsWith(`${route}/`);
    });

    if (isForbidden) {
        console.warn('[Auth] Callback URL rejected: Forbidden path:', pathname);
        return defaultUrl;
    }

    // URL is valid
    return trimmedUrl;
}

/**
 * Decodes a callback URL from query parameters and validates it
 *
 * @param encodedUrl - URL-encoded callback URL from query params
 * @param options - Validation options
 * @returns A safe callback URL or the default URL
 *
 * @example
 * decodeAndValidateCallbackUrl('%2Fdashboard') // '/dashboard'
 * decodeAndValidateCallbackUrl('https%3A%2F%2Fevil.com') // '/' (rejected)
 */
export function decodeAndValidateCallbackUrl(
    encodedUrl: string | null | undefined,
    options: ValidateCallbackUrlOptions = {}
): string {
    if (!encodedUrl) {
        return options.defaultUrl || '/';
    }

    let decodedUrl: string;
    try {
        decodedUrl = decodeURIComponent(encodedUrl);
    } catch (error) {
        console.warn('[Auth] Failed to decode callback URL:', encodedUrl, error);
        return options.defaultUrl || '/';
    }

    return validateCallbackUrl(decodedUrl, options);
}
