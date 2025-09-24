import { NextAuthResult } from 'next-auth';
import { generateNextAuthConfig } from '@maany_shr/e-class-auth';
import { getTRPCUrl } from '../../../common/utils/get-cms-query-client';
import { getLocale } from 'next-intl/server';
import env from '../env';

const auth0ClientID = env.AUTH_AUTH0_CLIENT_ID;
const auth0ClientSecret = env.AUTH_AUTH0_CLIENT_SECRET;
const auth0Issuer = env.AUTH_AUTH0_ISSUER;
const auth0AuthorizationUrl = env.AUTH_AUTH0_AUTHORIZATION_URL;
const auth0RolesClaimKey = env.AUTH_AUTH0_ROLES_CLAIM_KEY;
const useTestAccounts = env.AUTH_ENABLE_TEST_ACCOUNTS;

if (
    !auth0ClientID ||
    !auth0ClientSecret ||
    !auth0Issuer ||
    !auth0AuthorizationUrl ||
    !auth0RolesClaimKey
) {
    throw new Error(
        'Missing required environment variables for Auth0 configuration. Please make sure to set the following environment variables: AUTH_AUTH0_CLIENT_ID, AUTH_AUTH0_CLIENT_SECRET, AUTH_AUTH0_ISSUER, AUTH_AUTH0_AUTHORIZATION_URL, AUTH_AUTH0_ROLES_CLAIM_KEY',
    );
}
const nextAuth: NextAuthResult = generateNextAuthConfig({
    auth0: {
        clientId: auth0ClientID,
        clientSecret: auth0ClientSecret,
        issuer: auth0Issuer,
        authorizationUrl: auth0AuthorizationUrl,
    },
    pages: {
        signIn: '/en/auth/login', // TODO: Localization should be handled in middleware. See middleware.ts
        error: '/en/auth/error', // TODO: Localization should be handled in middleware. See middleware.ts
    },
    useTestAccounts: useTestAccounts,
    trpc: {
        getTrpcUrl: () => getTRPCUrl(),
        getPlatformHeaders: () => {
            const headers: Record<string, string> = {};
            // Add platform header
            if (env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME) {
                headers['x-eclass-runtime'] = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
            }
            return headers;
        },
        getLocale: async () => {
            try {
                const locale = await getLocale();
                return locale;
            } catch (error) {
                console.warn('Failed to get locale in auth:', error);
                return undefined;
            }
        }
    }
});
export default nextAuth;
