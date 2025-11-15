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

    // Extract locale from pathname
    const pathnameLocale = i18nConfig.locales.find(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Normalize pathname by removing locale prefix if it exists
    // This allows checking both /offers and /en/offers with the same logic
    const normalizedPath = pathnameLocale
        ? pathname.replace(new RegExp(`^/${pathnameLocale}`), '') || '/'
        : pathname;

    // Skip auth check for public routes, auth routes, API routes, and static files
    const isPublicRoute = pathname.includes('/auth/') ||
                         pathname.includes('/api/') ||
                         pathname.includes('/_next/') ||
                         pathname.includes('/favicon') ||
                         pathname.endsWith('.png') ||
                         pathname.endsWith('.jpg') ||
                         pathname.endsWith('.svg') ||
                         pathname.endsWith('.ico') ||
                         normalizedPath === '/' ||
                         normalizedPath.startsWith('/offers') ||
                         normalizedPath.startsWith('/courses/') ||
                         normalizedPath.startsWith('/packages/') ||
                         normalizedPath.startsWith('/coaches/') ||
                         normalizedPath.startsWith('/coaching') ||
                         normalizedPath.startsWith('/about') ||
                         normalizedPath.startsWith('/privacy-policy') ||
                         normalizedPath.startsWith('/terms-of-use') ||
                         normalizedPath.startsWith('/impressum') ||
                         normalizedPath.startsWith('/rules') ||
                         normalizedPath.startsWith('/offer-information') ||
                         normalizedPath.startsWith('/become-a-coach') ||
                         normalizedPath.startsWith('/students/') ||
                         normalizedPath.startsWith('/checkout');

    if (!isPublicRoute) {
        // Get the session using NextAuth's auth function
        const session = await auth();

        // Use extracted locale or default
        const locale = pathnameLocale || i18nConfig.defaultLocale;

        // Check if user is authenticated
        if (!session) {
            // Redirect to login page with callback URL
            const loginUrl = new URL(`/${locale}/auth/login`, req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Continue with i18n middleware
    return i18n(req);
}
export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
