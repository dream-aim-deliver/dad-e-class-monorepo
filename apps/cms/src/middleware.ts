import createMiddleware from 'next-intl/middleware';
import { i18nConfig } from '@maany_shr/e-class-translations';
import AuthContext from './lib/infrastructure/server/config/auth/next-auth.config';
import { NextRequest, NextResponse } from 'next/server';

const auth = AuthContext.auth;

const i18n = createMiddleware({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
});

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip auth check for auth routes, API routes, and static files
    const isPublicRoute = pathname.includes('/auth/') ||
                         pathname.includes('/api/') ||
                         pathname.includes('/_next/') ||
                         pathname.includes('/favicon') ||
                         pathname.endsWith('.png') ||
                         pathname.endsWith('.jpg') ||
                         pathname.endsWith('.svg');

    // Check if this is the access-denied page (needs special handling)
    const isAccessDeniedPage = pathname.includes('/auth/access-denied');

    if (!isPublicRoute) {
        // Get the session with TRPC-fetched roles using NextAuth's auth function
        const session = await auth();

        // Extract locale from pathname
        const pathnameLocale = i18nConfig.locales.find(
            locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );
        const locale = pathnameLocale || i18nConfig.defaultLocale;

        // Check if user is authenticated
        if (!session) {
            // Redirect to login page
            const loginUrl = new URL(`/${locale}/auth/login`, req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check if user has admin role (but skip this check for access-denied page)
        if (!isAccessDeniedPage) {
            // Debug: Log the session structure to verify TRPC roles
            console.log('[Middleware Debug] Full session structure:', JSON.stringify(session, null, 2));
            console.log('[Middleware Debug] session.user:', JSON.stringify(session?.user, null, 2));
            console.log('[Middleware Debug] session.user.roles:', session?.user?.roles);

            const userRoles = session?.user?.roles || [];
            console.log('[Middleware Debug] Extracted userRoles:', userRoles);
            console.log('[Middleware Debug] userRoles type:', typeof userRoles);
            console.log('[Middleware Debug] userRoles isArray:', Array.isArray(userRoles));

            const isAdmin = userRoles.includes('admin') || userRoles.includes('superadmin');
            console.log('[Middleware Debug] isAdmin:', isAdmin);

            if (!isAdmin) {
                console.log('[Middleware Debug] Redirecting to access denied - user roles:', userRoles);
                // Redirect to access denied page
                const accessDeniedUrl = new URL(`/${locale}/auth/access-denied`, req.url);
                return NextResponse.redirect(accessDeniedUrl);
            } else {
                console.log('[Middleware Debug] Admin access granted!');
            }
        }
    }

    // Continue with i18n middleware
    return i18n(req);
}
export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
