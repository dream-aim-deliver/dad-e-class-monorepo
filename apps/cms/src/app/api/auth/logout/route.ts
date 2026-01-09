import { NextRequest, NextResponse } from 'next/server';
import nextAuth from '../../../../lib/infrastructure/server/config/auth/next-auth.config';
import env from '../../../../lib/infrastructure/server/config/env';

export async function GET(request: NextRequest) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/auth/login';
    const baseUrl = env.NEXT_PUBLIC_APP_URL;

    // Get session to extract id_token for OIDC-compliant logout
    const session = await nextAuth.auth();
    const idToken = (session?.user as any)?.idToken;

    const auth0Issuer = env.AUTH_AUTH0_ISSUER;
    const auth0ClientId = env.AUTH_AUTH0_CLIENT_ID;

    // Construct the full return URL
    const fullReturnTo = returnTo.startsWith('http')
        ? returnTo
        : `${baseUrl}${returnTo}`;

    // Build OIDC-compliant logout URL using /oidc/logout endpoint
    // This is the proper way to log out from Auth0 per OIDC spec
    const sanitizedIssuer = auth0Issuer.endsWith('/')
        ? auth0Issuer.slice(0, -1)
        : auth0Issuer;
    const logoutUrl = new URL(`${sanitizedIssuer}/oidc/logout`);

    // id_token_hint is recommended by Auth0 for proper session identification
    if (idToken) {
        logoutUrl.searchParams.set('id_token_hint', idToken);
    }

    // post_logout_redirect_uri must be in Allowed Logout URLs in Auth0 Dashboard
    logoutUrl.searchParams.set('post_logout_redirect_uri', fullReturnTo);

    // Include client_id for additional verification
    logoutUrl.searchParams.set('client_id', auth0ClientId);

    // Create redirect response
    const response = NextResponse.redirect(logoutUrl.toString());

    // Clear NextAuth session cookies (both secure and non-secure variants)
    const cookieOptions = {
        path: '/',
        expires: new Date(0),
    };

    // NextAuth v5 (Auth.js) cookie names
    response.cookies.set('authjs.session-token', '', cookieOptions);
    response.cookies.set('__Secure-authjs.session-token', '', cookieOptions);
    response.cookies.set('authjs.csrf-token', '', cookieOptions);
    response.cookies.set('__Secure-authjs.csrf-token', '', cookieOptions);
    response.cookies.set('authjs.callback-url', '', cookieOptions);
    response.cookies.set('__Secure-authjs.callback-url', '', cookieOptions);

    return response;
}
