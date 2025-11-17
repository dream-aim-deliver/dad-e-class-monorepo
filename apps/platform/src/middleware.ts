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

    // Skip auth check for public routes, auth routes, API routes, and static files
    const isPublicRoute = pathname.includes('/auth/') ||
                         pathname.includes('/api/') ||
                         pathname.includes('/_next/') ||
                         pathname.includes('/favicon') ||
                         pathname.includes('/courses/') ||
                         pathname.endsWith('.png') ||
                         pathname.endsWith('.jpg') ||
                         pathname.endsWith('.svg') ||
                         pathname.endsWith('.ico');

    if (!isPublicRoute) {
        // Get the session using NextAuth's auth function
        const session = await auth();

        // Extract locale from pathname
        const pathnameLocale = i18nConfig.locales.find(
            locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );
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
