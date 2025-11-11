import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Auth0, { Auth0Profile } from "next-auth/providers/auth0"
import { TAuthProviderProfileDTO } from "../../core/dto/auth-provider-dto";
import { DefaultJWT } from "next-auth/jwt"
import { Account } from "next-auth"
import { TEST_ACCOUNTS } from "../utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import superjson from 'superjson';
import { TEClassRole } from "@dream-aim-deliver/e-class-cms-rest/lib/core";
/**
 * Generates the NextAuth configuration object.
 *
 * @param config - Configuration object containing Auth0 and test account settings.
 * @param config.auth0 - Auth0 configuration settings.
 * @param config.auth0.clientId - The Auth0 client ID.
 * @param config.auth0.clientSecret - The Auth0 client secret.
 * @param config.auth0.issuer - The Auth0 issuer.
 * @param config.auth0.authorizationUrl - The Auth0 authorization URL.
 * @param config.auth0.rolesClaimKey - The key for roles claim in Auth0 profile.
 * @param config.useTestAccounts - Flag to indicate if test accounts should be used. If true, the credentials provider is added to the providers list. Test Accounts are defined in the {@link TEST_ACCOUNTS} constant of `@maany_shr/e-class-auth` package.
 * @param config.pages - Configuration for custom pages.
 * @param config.pages.signIn - URL of the sign-in page.
 * @param config.pages.error - URL of the error page.
 * @returns The NextAuth result object.
 */
export const generateNextAuthConfig = (config: {
    auth0: {
        clientId: string;
        clientSecret: string;
        issuer: string;
        authorizationUrl: string;
    },
    useTestAccounts: boolean,
    pages: {
        signIn: string,
        error: string,
    },
    trpc: {
        getTrpcUrl: () => string,
        getPlatformHeaders: () => Record<string, string>,
        getLocale?: () => string | undefined | Promise<string | undefined>
    }
}
): NextAuthResult => {

    const credentialsProvider = CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            const { username, password } = credentials as { username: string, password: string };
            const validUser = TEST_ACCOUNTS.find(user => user.name === username && user.password === password);
            if (validUser) {
                return Promise.resolve(validUser);
            }
            return null;
        }
    })

    const nextAuthConfig: NextAuthConfig = {
        trustHost: true,
        session: {
            strategy: "jwt",
            // Set session maxAge to 24 hours (Auth0 default token expiry)
            // This can be overridden by token expiration if refresh fails
            maxAge: 24 * 60 * 60, // 24 hours in seconds
        },
        pages: {
            signIn: `${config.pages.signIn}`,
            error: `${config.pages.error}`,
        },
        providers: [
            Auth0({
                clientId: config.auth0.clientId,
                clientSecret: config.auth0.clientSecret,
                issuer: config.auth0.issuer,
                authorization: {
                    params: {
                        scope: "openid profile email roles offline_access",
                    },
                    url: config.auth0.authorizationUrl,
                },
                profile: (profile: Auth0Profile) => {
                    // const ROLES_CLAIM = config.auth0.rolesClaimKey;
                    // let roles: role.TRole[] = ['visitor']; // default role
                    // if (ROLES_CLAIM && profile[ROLES_CLAIM]) {
                    //     roles = profile[ROLES_CLAIM];
                    // }
                    // extract relevant fields from the Auth0 profile to populate the AuthProfile object
                    // the returned object is passed to the jwt callback as the user object
                    return {
                        provider: "auth0",
                        externalID: profile.sub,
                        name: profile.name,
                        nickname: profile.nickname,
                        sub: profile.sub,
                        email: profile.email,
                        image: profile.picture,
                        sid: profile.sid,
                        issuer: profile.iss,
                        expires: profile.exp,
                    } as TAuthProviderProfileDTO;
                }
            })
        ],
        callbacks: {
            jwt: async ({ token, user, account, profile, trigger }) => {
                // Initial sign in - store user and account data
                if (user) {
                    token.user = user;
                }
                if (account) {
                    token.account = account;
                    // Store when the access token expires
                    token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
                }

                // Return previous token if the access token has not expired yet
                const currentTime = Date.now();
                const tokenExpires = (token.accessTokenExpires as number) || 0;

                // Refresh token 5 minutes before expiration to avoid edge cases
                const shouldRefresh = tokenExpires - currentTime < 5 * 60 * 1000;

                if (!shouldRefresh) {
                    console.log('[Auth JWT] ✅ Token still valid, no refresh needed');
                    return token;
                }

                // Access token has expired or will expire soon, try to refresh it
                console.log('[Auth JWT] 🔄 Access token expired or expiring soon, attempting refresh...');
                const refreshToken = (token.account as Account)?.refresh_token;

                if (!refreshToken) {
                    console.error('[Auth JWT] ❌ No refresh token available, cannot refresh session');
                    // Mark token as expired so client can handle logout
                    token.error = 'RefreshTokenMissing';
                    return token;
                }

                try {
                    const tokenEndpoint = `${config.auth0.issuer}/oauth/token`;
                    console.log('[Auth JWT] 📡 Refreshing token at:', tokenEndpoint);

                    const response = await fetch(tokenEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            grant_type: 'refresh_token',
                            client_id: config.auth0.clientId,
                            client_secret: config.auth0.clientSecret,
                            refresh_token: refreshToken,
                        }),
                    });

                    const refreshedTokens = await response.json();

                    if (!response.ok) {
                        console.error('[Auth JWT] ❌ Token refresh failed:', refreshedTokens);
                        throw new Error(refreshedTokens.error || 'Token refresh failed');
                    }

                    console.log('[Auth JWT] ✅ Token refreshed successfully');

                    // Update the token with refreshed credentials
                    const updatedAccount = {
                        ...(token.account as Account),
                        access_token: refreshedTokens.access_token,
                        id_token: refreshedTokens.id_token,
                        expires_at: Math.floor(Date.now() / 1000) + (refreshedTokens.expires_in || 3600),
                        refresh_token: refreshedTokens.refresh_token || refreshToken,
                    };

                    return {
                        ...token,
                        account: updatedAccount,
                        accessTokenExpires: (updatedAccount.expires_at || 0) * 1000,
                        error: undefined,
                    };
                } catch (error) {
                    console.error('[Auth JWT] ❌ Error refreshing access token:', error);
                    // Mark token as expired so client can handle logout
                    return {
                        ...token,
                        error: 'RefreshAccessTokenError',
                    };
                }
            },
            session: async ({ session, token }) => {
                // console.log('[Auth Session] 🔄 Invoking session callback. Token:', token.jti);
                const defaultSessionRoles: ("visitor" | "student" | "coach" | "course_creator" | "admin" | "superadmin")[] = ["visitor", "student"]

                // Get the token for authorization
                const nextAuthToken = token as DefaultJWT & {
                    user: TAuthProviderProfileDTO,
                    account: Account,
                    error?: string
                }

                // Propagate error to session for client-side handling
                if (nextAuthToken.error) {
                    console.error('[Auth Session] ❌ Token error detected:', nextAuthToken.error);
                    (session as any).error = nextAuthToken.error;
                }

                // Create TRPC client with authorization header
                const trpcClient = createTRPCClient<TAppRouter>({
                    links: [
                        httpBatchLink({
                            transformer: superjson,
                            url: config.trpc.getTrpcUrl(),
                            async headers() {
                                const headers: Record<string, string> = config.trpc.getPlatformHeaders();

                                // Add Authorization header if we have an ID token
                                if (nextAuthToken.account?.id_token) {
                                    headers['Authorization'] = `Bearer ${nextAuthToken.account.id_token}`;
                                    headers['x-eclass-session-id'] = nextAuthToken.jti? nextAuthToken.jti : 'public';
                                } else {
                                    console.warn('[Auth TRPC] ⚠️ Missing ID token in NextAuth session callback', {
                                        hasAccount: !!nextAuthToken.account,
                                        accountKeys: nextAuthToken.account ? Object.keys(nextAuthToken.account) : [],
                                        hasAccessToken: !!nextAuthToken.account?.access_token
                                    });
                                }

                                // Add Accept-Language header if locale is available
                                const locale = await config.trpc.getLocale?.();
                                if (locale) {
                                    headers['Accept-Language'] = locale;
                                } else {
                                    console.warn('[Auth TRPC] ⚠️ No locale available for NextAuth TRPC client');
                                }

                                return headers;
                            },
                        }),
                    ],
                });

                try {
                    // console.log("[Auth Session] 🚀 Requesting User Roles for session callback");
                    const userRolesDTO = await trpcClient.listUserRoles.query({});
                    // console.log("[Auth Session] 📦 User Roles Response:", JSON.stringify(userRolesDTO, null, 2));
                    if (userRolesDTO.success && userRolesDTO.data) {
                        const allowedRoles = ["visitor", "student", "coach", "course_creator", "admin", "superadmin"] as const;
                        // The response has data.roles, not data as an array
                        const roles = (userRolesDTO.data as any).roles as TEClassRole[];
                        if (Array.isArray(roles)) {
                            session.user.roles = roles.filter(
                                (role): role is typeof allowedRoles[number] => allowedRoles.includes(role as any)
                            );
                        }
                    } else {
                        session.user.roles = defaultSessionRoles
                    }

                } catch (error) {
                    console.error('[Auth Session] ❌ Failed to fetch user roles in session callback:', error);
                    if (error instanceof Error) {
                        console.error('[Auth Session] Error details:', {
                            message: error.message,
                            stack: error.stack?.slice(0, 500)
                        });
                    }
                    session.user.roles = defaultSessionRoles
                }

                // CRITICAL [WE SHOULD REMOVE THIS AND PROXY VIA A SERVER SIDE CACHE/ROUTE]: Set the tokens on the session so they're available client-side
                session.user.accessToken = nextAuthToken.account.access_token;
                session.user.idToken = nextAuthToken.account.id_token;

                if (!session.user.accessToken || !session.user.idToken) {
                    return session;
                }

                try {
                    // console.log("[Auth Session] 🚀 Requesting User Details for session callback");
                    const getUserForSessionDTO = await trpcClient.getUserDetailsForSession.query({
                        userSub: nextAuthToken.user.sub,
                        defaultImage: nextAuthToken.user.image
                    });
                    // console.log("[Auth Session] 📦 User Details Response:", JSON.stringify(getUserForSessionDTO, null, 2));
                    if (getUserForSessionDTO.success == true && getUserForSessionDTO.data) {
                        const responseData = getUserForSessionDTO.data as unknown as typeof getUserForSessionDTO.data.data; // getting around the type issue temporarily
                        session.user.id = responseData.id.toString();
                        session.user.email = responseData.email;
                        session.user.name = responseData.username;
                        session.user.image = responseData.avatarImage || undefined;
                        // console.log("[Auth Session] ✅ User details populated successfully");
                    }
                } catch (error) {
                    console.error('[Auth Session] ❌ Failed to fetch user details in session callback:', error);
                    if (error instanceof Error) {
                        console.error('[Auth Session] Error details:', {
                            message: error.message,
                            stack: error.stack?.slice(0, 500)
                        });
                    }
                }

                // console.log('[Auth Session] ✅ Session prepared with:', {
                //     hasIdToken: !!session.user.idToken,
                //     hasAccessToken: !!session.user.accessToken,
                //     roles: session.user.roles,
                //     userId: session.user.id,
                //     email: session.user.email,
                //     name: session.user.name,
                //     hasImage: !!session.user.image,
                // });

                return session;
            }
        }
    }

    if (config.useTestAccounts) {
        if (process.env.NODE_ENV === 'production' && process.env.E_CLASS_DEV_MODE?.trim().toLocaleLowerCase() !== 'true') {
            console.error('❗❗❗ Test accounts are not allowed in production environment. This is a security risk!!. Please disable test accounts in production.');
        } else {
            console.warn('⚠️⚠️⚠️ Test accounts are enabled. This is a security risk. Please make sure this is only used in development or testing environments.');
            nextAuthConfig.providers.push(credentialsProvider);
        }
    }
    return NextAuth(nextAuthConfig)
}
