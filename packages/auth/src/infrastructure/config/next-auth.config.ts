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
 * Decodes a JWT and extracts the exp claim.
 * JWTs are base64url encoded, so we can decode without a library.
 * @param jwt The JWT string to decode
 * @returns The exp claim value (seconds since epoch) or null if decoding fails
 */
function getJwtExpiration(jwt: string): number | null {
    try {
        const parts = jwt.split('.');
        if (parts.length !== 3) return null;

        // Decode the payload (second part) - base64url to string
        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString('utf-8')
        );

        return typeof payload.exp === 'number' ? payload.exp : null;
    } catch {
        return null;
    }
}

/**
 * Cached user data structure stored in JWT token
 */
interface CachedUserData {
    roles: TEClassRole[];
    userDetails: {
        id: string;
        email: string;
        username: string;
        avatarImage?: string;
    } | null;
}

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

    /**
     * Helper function to fetch user roles and details via tRPC.
     * Called during initial sign-in and token refresh to cache data in JWT.
     */
    const fetchUserDataForCache = async (
        idToken: string,
        jti: string | undefined,
        userSub: string,
        defaultImage: string | undefined
    ): Promise<CachedUserData> => {
        const defaultRoles: TEClassRole[] = ["visitor", "student"];
        const defaultResult: CachedUserData = { roles: defaultRoles, userDetails: null };

        try {
            const trpcClient = createTRPCClient<TAppRouter>({
                links: [
                    httpBatchLink({
                        transformer: superjson,
                        url: config.trpc.getTrpcUrl(),
                        async headers() {
                            const headers: Record<string, string> = config.trpc.getPlatformHeaders();
                            headers['Authorization'] = `Bearer ${idToken}`;
                            headers['x-eclass-session-id'] = jti || 'public';

                            const locale = await config.trpc.getLocale?.();
                            if (locale) {
                                headers['Accept-Language'] = locale;
                            }

                            return headers;
                        },
                    }),
                ],
            });

            // Fetch roles
            let roles: TEClassRole[] = defaultRoles;
            try {
                const userRolesDTO = await trpcClient.listUserRoles.query({});
                if (userRolesDTO.success && userRolesDTO.data) {
                    const allowedRoles = ["visitor", "student", "coach", "course_creator", "admin", "superadmin"] as const;
                    const fetchedRoles = (userRolesDTO.data as any).roles as TEClassRole[];
                    if (Array.isArray(fetchedRoles)) {
                        roles = fetchedRoles.filter(
                            (role): role is typeof allowedRoles[number] => allowedRoles.includes(role as any)
                        );
                    }
                }
            } catch (error) {
                console.error('[Auth JWT] Failed to fetch user roles:', error);
            }

            // Fetch user details
            let userDetails: CachedUserData['userDetails'] = null;
            try {
                const getUserForSessionDTO = await trpcClient.getUserDetailsForSession.query({
                    userSub: userSub,
                    defaultImage: defaultImage
                });
                if (getUserForSessionDTO.success && getUserForSessionDTO.data) {
                    const responseData = getUserForSessionDTO.data as { id: number; email: string; username: string; avatarImage?: string };
                    userDetails = {
                        id: responseData.id.toString(),
                        email: responseData.email,
                        username: responseData.username,
                        avatarImage: responseData.avatarImage || undefined,
                    };
                }
            } catch (error) {
                console.error('[Auth JWT] Failed to fetch user details:', error);
            }

            console.log('[Auth JWT] Cached user data fetched successfully', {
                roles,
                hasUserDetails: !!userDetails
            });

            return { roles, userDetails };
        } catch (error) {
            console.error('[Auth JWT] Failed to create tRPC client for user data fetch:', error);
            return defaultResult;
        }
    };

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
            jwt: async ({ token, user, account, profile, trigger, session }) => {
                // Initial sign in - store user and account data
                if (user) {
                    token.user = user;
                }
                if (account) {
                    token.account = account;

                    // On initial sign-in, fetch and cache user roles and details
                    if (account.id_token) {
                        console.log('[Auth JWT] Initial sign-in detected, fetching user data for cache...');
                        const userData = user as TAuthProviderProfileDTO;
                        const cachedData = await fetchUserDataForCache(
                            account.id_token,
                            token.jti,
                            userData.sub,
                            userData.image
                        );
                        token.cachedRoles = cachedData.roles;
                        token.cachedUserDetails = cachedData.userDetails;
                    }
                }

                // Use token.user.expires as the source of truth for ID token expiration
                // This comes from the Auth0 profile.exp field (ID token) and is in seconds since epoch
                // The tRPC backend validates the ID token, so we use its expiration
                const userExpires = (token.user as TAuthProviderProfileDTO)?.expires;

                if (userExpires && typeof userExpires === 'number') {
                    token.idTokenExpires = userExpires * 1000; // Convert to milliseconds
                }

                // Return previous token if the ID token has not expired yet
                const currentTime = Date.now();

                // If idTokenExpires is missing, we should attempt to refresh rather than assume validity
                // This ensures expired sessions are properly detected
                const tokenExpires = token.idTokenExpires as number;
                const timeUntilExpiry = tokenExpires ? tokenExpires - currentTime : -1;
                const minutesUntilExpiry = Math.floor(timeUntilExpiry / 1000 / 60);

                // Refresh token 5 minutes before expiration to avoid edge cases
                // Also refresh if idTokenExpires is missing (timeUntilExpiry < 0)
                const shouldRefresh = !tokenExpires || timeUntilExpiry < 5 * 60 * 1000;

                // Handle explicit session update (e.g. after profile picture or username change)
                if (trigger === 'update') {
                    // If data was passed directly via updateSession({ image: ..., name: ... }),
                    // use it without making a backend call (avoids expired token issues)
                    if (session && typeof session === 'object' && ('image' in session || 'name' in session)) {
                        if (token.cachedUserDetails) {
                            token.cachedUserDetails = {
                                ...token.cachedUserDetails,
                                ...('image' in session && { avatarImage: (session as any).image || undefined }),
                                ...('name' in session && { username: (session as any).name }),
                            };
                        }
                        return token;
                    }

                    // Fallback: re-fetch from backend (used by session monitor)
                    const idToken = (token.account as Account)?.id_token;
                    if (idToken) {
                        console.log('[Auth JWT] 🔄 Session update triggered, re-fetching user data...');
                        const cachedData = await fetchUserDataForCache(
                            idToken,
                            token.jti,
                            (token.user as TAuthProviderProfileDTO).sub,
                            (token.user as TAuthProviderProfileDTO).image
                        );
                        token.cachedRoles = cachedData.roles;
                        token.cachedUserDetails = cachedData.userDetails;
                    }
                    return token;
                }

                if (!shouldRefresh) {
                    console.log(`[Auth JWT] ✅ ID token still valid, no refresh needed (expires in ${minutesUntilExpiry} minutes)`);
                    return token;
                }

                // ID token has expired or will expire soon, try to refresh it
                console.log(`[Auth JWT] 🔄 ID token expired or expiring soon (${minutesUntilExpiry} minutes left), attempting refresh...`);
                const refreshToken = (token.account as Account)?.refresh_token;

                if (!refreshToken) {
                    console.error('[Auth JWT] ❌ No refresh token available, cannot refresh session');
                    // Mark token as expired so client can handle logout
                    token.error = 'RefreshTokenMissing';
                    return token;
                }

                // Retry logic with exponential backoff
                // Reduced retries for faster failure detection on expired sessions
                const maxRetries = 2;
                let lastError: Error | null = null;

                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        const tokenEndpoint = `${config.auth0.issuer}/oauth/token`;
                        console.log(`[Auth JWT] 📡 Refreshing token at: ${tokenEndpoint} (attempt ${attempt}/${maxRetries})`);

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
                            // Differentiate failure types: 401/403 = expired/invalid (no retry)
                            // vs network errors/5xx = transient (retry with backoff)
                            if (response.status === 401 || response.status === 403) {
                                console.error(`[Auth JWT] ❌ Token refresh failed with ${response.status}: Token expired or invalid, failing immediately`);
                                // Don't retry on authentication failures - fail fast
                                throw new Error(refreshedTokens.error || 'Token expired or invalid');
                            }

                            console.error(`[Auth JWT] ❌ Token refresh failed with ${response.status} (attempt ${attempt}/${maxRetries}):`, refreshedTokens);
                            throw new Error(refreshedTokens.error || 'Token refresh failed');
                        }

                        console.log('[Auth JWT] ✅ Token refreshed successfully');

                        // Extract expiration from the new ID token (what tRPC backend validates)
                        // This is more accurate than using expires_in which is access token lifetime
                        const idTokenExp = getJwtExpiration(refreshedTokens.id_token);
                        const newExpiresAt = idTokenExp || Math.floor(Date.now() / 1000) + 3600; // fallback to 1 hour

                        if (idTokenExp) {
                            console.log(`[Auth JWT] ID token expires at: ${new Date(idTokenExp * 1000).toISOString()}`);
                        } else {
                            console.warn('[Auth JWT] Could not decode ID token exp, using fallback expiration');
                        }

                        // Update the token with refreshed credentials
                        const updatedAccount = {
                            ...(token.account as Account),
                            access_token: refreshedTokens.access_token,
                            id_token: refreshedTokens.id_token,
                            expires_at: newExpiresAt,
                            refresh_token: refreshedTokens.refresh_token || refreshToken,
                        };

                        // Update the user expires field to keep it in sync
                        const updatedUser = {
                            ...(token.user as TAuthProviderProfileDTO),
                            expires: newExpiresAt,
                        };

                        // Re-fetch and cache user data with the new token
                        console.log('[Auth JWT] Fetching user data after token refresh...');
                        const cachedData = await fetchUserDataForCache(
                            refreshedTokens.id_token,
                            token.jti,
                            (token.user as TAuthProviderProfileDTO).sub,
                            (token.user as TAuthProviderProfileDTO).image
                        );

                        return {
                            ...token,
                            user: updatedUser,
                            account: updatedAccount,
                            idTokenExpires: newExpiresAt * 1000,
                            error: undefined,
                            cachedRoles: cachedData.roles,
                            cachedUserDetails: cachedData.userDetails,
                        };
                    } catch (error) {
                        lastError = error as Error;

                        // Check if this is an authentication failure (401/403) - fail immediately
                        if (lastError.message.includes('expired or invalid')) {
                            console.error('[Auth JWT] ❌ Authentication failure detected, skipping retries');
                            break; // Exit retry loop immediately
                        }

                        console.error(`[Auth JWT] ❌ Error refreshing access token (attempt ${attempt}/${maxRetries}):`, error);

                        // If not the last attempt, wait with exponential backoff (faster: 500ms, 1s)
                        if (attempt < maxRetries) {
                            const backoffMs = Math.pow(2, attempt - 1) * 500; // 500ms, 1s
                            console.log(`[Auth JWT] ⏳ Waiting ${backoffMs}ms before retry...`);
                            await new Promise(resolve => setTimeout(resolve, backoffMs));
                        }
                    }
                }

                // All retries failed
                console.error('[Auth JWT] ❌ All token refresh attempts failed, marking session as expired');
                return {
                    ...token,
                    error: 'RefreshAccessTokenError',
                };
            },
            session: async ({ session, token }) => {
                // console.log('[Auth Session] 🔄 Invoking session callback. Token:', token.jti);
                const defaultSessionRoles: ("visitor" | "student" | "coach" | "course_creator" | "admin" | "superadmin")[] = ["visitor", "student"]

                // Get the token for authorization
                const nextAuthToken = token as DefaultJWT & {
                    user: TAuthProviderProfileDTO,
                    account: Account,
                    error?: string,
                    cachedRoles?: TEClassRole[],
                    cachedUserDetails?: CachedUserData['userDetails'],
                    idTokenExpires?: number
                }

                // Align session.expires with actual token expiry (not the 24h maxAge)
                // This ensures useSession() on the client knows the real expiry time
                // and can set precise timeouts for session validation
                if (nextAuthToken.idTokenExpires) {
                    // Type assertion needed because NextAuth's Session type expects Date & string
                    // but we're setting it to an ISO string which is the actual runtime format
                    (session as any).expires = new Date(nextAuthToken.idTokenExpires).toISOString();
                }

                // Propagate error to session for client-side handling
                if (nextAuthToken.error) {
                    console.error('[Auth Session] ❌ Token error detected:', nextAuthToken.error);
                    (session as any).error = nextAuthToken.error;
                }

                // Read roles from JWT cache (populated in JWT callback during sign-in/refresh)
                if (nextAuthToken.cachedRoles && Array.isArray(nextAuthToken.cachedRoles)) {
                    session.user.roles = nextAuthToken.cachedRoles;
                } else {
                    session.user.roles = defaultSessionRoles;
                }

                // CRITICAL [WE SHOULD REMOVE THIS AND PROXY VIA A SERVER SIDE CACHE/ROUTE]: Set the tokens on the session so they're available client-side
                session.user.accessToken = nextAuthToken.account.access_token;
                session.user.idToken = nextAuthToken.account.id_token;

                if (!session.user.accessToken || !session.user.idToken) {
                    return session;
                }

                // Read user details from JWT cache (populated in JWT callback during sign-in/refresh)
                if (nextAuthToken.cachedUserDetails) {
                    session.user.id = nextAuthToken.cachedUserDetails.id;
                    session.user.email = nextAuthToken.cachedUserDetails.email;
                    session.user.name = nextAuthToken.cachedUserDetails.username;
                    session.user.image = nextAuthToken.cachedUserDetails.avatarImage || undefined;
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
