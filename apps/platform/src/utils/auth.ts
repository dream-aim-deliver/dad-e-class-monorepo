import NextAuth, { NextAuthResult } from "next-auth"
import Auth0, { Auth0Profile } from "next-auth/providers/auth0"
import { DefaultJWT } from "next-auth/jwt"
import { TAuthProviderProfile, TRole, PlatformSchema, extractPlatformSpecificRoles, TPlatform, SessionUserSchema, RoleSchema } from "@maany_shr/e-class-auth";
import { Account } from "next-auth"

const nextAuth: NextAuthResult = NextAuth({
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    providers: [
        Auth0({
            clientId: process.env.AUTH_AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH_AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH_AUTH0_ISSUER,
            authorization: {
                params: {
                    scope: "openid profile email roles",
                },
                url: process.env.AUTH_AUTH0_AUTHORIZATION_URL,
            },
            profile: (profile: Auth0Profile) => {
                const ROLES_CLAIM = process.env.AUTH_AUTH0_ROLES_CLAIM_KEY
                let roles: TRole[] = ['visitor'];
                if (ROLES_CLAIM && profile[ROLES_CLAIM]) {
                    roles = profile[ROLES_CLAIM];
                }
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
                    roles: roles,
                } as TAuthProviderProfile;
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user, account, profile }) => {
            user && (token.user = user)
            account && (token.account = account)
            return token;
        },
        session: async ({ session, token }) => {
            const platform = process.env.E_CLASS_PLATFORM_SHORT_NAME
            if (!platform) {
                throw new Error("CRITICAL! Configuration Error: Platform name not found in the environment variables");
            }
            const isValidPlatform = PlatformSchema.safeParse(platform);
            if (!isValidPlatform.success) {
                // TODO log error
                throw new Error(`Invalid platform name ${platform}. Check the app configuration.`);
            }
            session.platform = platform as TPlatform;

            const nextAuthToken = token as DefaultJWT & {
                user: TAuthProviderProfile,
                account: Account
            }

            session.user.accessToken = nextAuthToken.account.access_token;
            session.user.idToken = nextAuthToken.account.id_token;

            // TODO query the database
            session.userId = nextAuthToken.user.sub;
            session.user.email = nextAuthToken.user.email;
            session.user.name = nextAuthToken.user.name;
            session.user.image = nextAuthToken.user.image;
            session.user.id = nextAuthToken.user.externalID;

            const roles = nextAuthToken.user.roles;
            const platformSpecificRoles = extractPlatformSpecificRoles(roles, platform);

            if (session.user.roles === undefined || session.user.roles.length === 0) {
                session.user.roles = ['visitor'];
            }

            platformSpecificRoles.forEach(role => {
                const isValidRole = RoleSchema.safeParse(role);
                if (!isValidRole.success) {
                    console.error(`Invalid role ${role}. Check the role configuration. Accepted values are ${RoleSchema.options.values}`);
                } else {
                    if (!session.user.roles?.includes(role))
                        session.user.roles?.push(role);
                }
            });
            // TODO: Enable this to align the session expiry with the token expiry, currently session_expiry < token_expiry
            // if (nextAuthToken.account.expires_at) {
            //     session.expires = new Date((nextAuthToken.account.expires_at) * 1000).toISOString() as unknown as (Date & string);
            // }
            return session;
        }
    }
})

export default nextAuth
