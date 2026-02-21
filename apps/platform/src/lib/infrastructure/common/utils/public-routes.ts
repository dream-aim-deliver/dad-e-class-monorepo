import { i18nConfig } from '@maany_shr/e-class-translations';

/**
 * Route classification for the Platform app:
 *
 * PURELY PUBLIC (10 routes): Same content regardless of login status
 *   - /, /about, /impressum, /privacy-policy, /rules, /terms-of-use,
 *     /offer-information, /offers, /become-a-coach, /cms-example
 *   - No session dependency at all
 *   - Session expiry modal: SKIP
 *
 * MIXED (4 routes): Public access but personalized when logged in
 *   - /coaching - prefetches different data when logged in
 *   - /packages/[id] - public but may prompt login for purchase
 *   - /coaches/[username] - uses session for forStudent param
 *   - /courses/[slug] - visitor view vs enrolled view
 *   - Session expiry modal: SHOW (user loses personalization)
 *
 * PROTECTED (20+ routes): Requires authentication
 *   - /coaches/[username]/book - redirects to login
 *   - /courses/[slug]/group - requires student role
 *   - /students/[slug] - requires coach/admin
 *   - /create/*, /edit/*, /workspace/* - all require auth
 *   - Session expiry modal: SHOW
 */

/**
 * Normalize pathname by removing locale prefix
 */
export function normalizePathname(pathname: string): string {
    const pathnameLocale = i18nConfig.locales.find(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    return pathnameLocale
        ? pathname.replace(new RegExp(`^/${pathnameLocale}`), '') || '/'
        : pathname;
}

/**
 * Purely public routes - same content for all users, no session dependency
 * These are the ONLY routes where session expiry is irrelevant
 */
const PURELY_PUBLIC_ROUTES = [
    '/',                    // Home page - only prefetches getHomePage, listTopics
    '/about',               // Static content, only prefetches platform language
    '/impressum',           // Static legal page
    '/privacy-policy',      // Static legal page
    '/rules',               // Static legal page
    '/terms-of-use',        // Static legal page
    '/offer-information',   // Static informational page
    '/offers',              // Offers listing - public catalog
    '/cms-example',         // Demo/test page
] as const;

/**
 * Mixed routes - public access but personalized when logged in
 * Session expiry DOES matter here (user loses personalization)
 */
const MIXED_ROUTES = [
    '/coaching',            // Prefetches listAvailableCoachings for signed-in users
    '/packages/',           // Package details - public but prompts login for purchase
    '/coaches/',            // Coach profile - forStudent param depends on login
    '/courses/',            // Course detail - visitor vs enrolled view
] as const;

/**
 * Routes where middleware allows access but page component enforces auth
 * These are effectively protected but middleware is permissive
 */
const PAGE_ENFORCED_AUTH_ROUTES = [
    '/students/',           // Requires coach/admin role (page redirects)
    '/checkout',            // May require auth for payment
] as const;

/**
 * Check if normalized path matches any route in the list
 * Handles both exact matches and prefix matches
 */
function matchesRouteList(normalizedPath: string, routes: readonly string[]): boolean {
    return routes.some(route => {
        if (route === '/') {
            return normalizedPath === '/';
        }
        // For routes with trailing slash: match prefix (e.g., /courses/ matches /courses/slug)
        // For routes without trailing slash: match exact or with trailing content
        if (route.endsWith('/')) {
            return normalizedPath.startsWith(route);
        }
        return normalizedPath === route || normalizedPath.startsWith(route + '/');
    });
}

/**
 * Check if a pathname is purely public (same content for everyone).
 * Used by SessionMonitor to skip expiration modal entirely.
 *
 * Returns TRUE only for routes where session state is completely irrelevant.
 * Returns FALSE for mixed/protected routes where session expiry matters.
 */
export function isPurelyPublicRoute(pathname: string): boolean {
    // Auth pages don't need session expired modal
    if (pathname.includes('/auth/')) {
        return true;
    }

    const normalizedPath = normalizePathname(pathname);
    return matchesRouteList(normalizedPath, PURELY_PUBLIC_ROUTES);
}

/**
 * Check if a pathname is a mixed route (public access with personalization).
 * Used by SessionMonitor to allow dismissing the expiration modal.
 *
 * On mixed routes, users can dismiss the modal and continue browsing
 * as a visitor (they'll see the public view instead of personalized content).
 */
export function isMixedRoute(pathname: string): boolean {
    const normalizedPath = normalizePathname(pathname);
    return matchesRouteList(normalizedPath, MIXED_ROUTES);
}

/**
 * Check if a pathname can be accessed without authentication.
 * Used by middleware to skip auth redirect.
 * Includes purely public + mixed + page-enforced routes.
 */
export function isPublicAccessibleRoute(pathname: string, normalizedPath?: string): boolean {
    // Auth, API, and static routes bypass auth entirely
    if (pathname.includes('/auth/') ||
        pathname.includes('/api/') ||
        pathname.includes('/_next/') ||
        pathname.includes('/favicon') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico')) {
        return true;
    }

    const normalized = normalizedPath ?? normalizePathname(pathname);

    return matchesRouteList(normalized, PURELY_PUBLIC_ROUTES) ||
           matchesRouteList(normalized, MIXED_ROUTES) ||
           matchesRouteList(normalized, PAGE_ENFORCED_AUTH_ROUTES);
}
