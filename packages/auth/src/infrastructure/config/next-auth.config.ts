import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Auth0, { Auth0Profile } from "next-auth/providers/auth0"
import { TAuthProviderProfileDTO } from "../../core/dto/auth-provider-dto";
import { DefaultJWT } from "next-auth/jwt"
import { role, platform } from "@maany_shr/e-class-models"
import { Account } from "next-auth"
import { extractPlatformSpecificRoles } from "../utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@maany_shr/e-class-models";

const TEST_ACCOUNTS: (auth.TSessionUser & {password: string})[] = [
    {
        id: '1',
        name: 'Conny',
        email: 'conny@e-class-dev.com',
        roles: ['admin'],
        password: 'test'
    },
]
export const generateNextAuthConfig = (config: {
    auth0: {
        clientId: string;
        clientSecret: string;
        issuer: string;
        authorizationUrl: string;
        rolesClaimKey: string;
    },
    useTestAccounts: boolean,
    pages: {
        signIn: string,
        error: string,
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
            if(validUser) {
                return Promise.resolve(validUser);
            }
            return null;
        }
    })

    const nextAuthConfig: NextAuthConfig = {
        trustHost: true,
        session: {
            strategy: "jwt",
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
                        scope: "openid profile email roles",
                    },
                    url: config.auth0.authorizationUrl,
                },
                profile: (profile: Auth0Profile) => {
                    const ROLES_CLAIM = process.env.AUTH_AUTH0_ROLES_CLAIM_KEY
                    let roles: role.TRole[] = ['visitor'];
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
                    } as TAuthProviderProfileDTO;
                }
            })
        ],
        callbacks: {
            jwt: async ({ token, user, account, profile }) => {
                console.log('JWT Debug: ', token);
                console.log('User Debug: ', user);
                user && (token.user = user)
                account && (token.account = account)
                return token;
            },
            session: async ({ session, token }) => {
                console.log('Session Debug: ', session);
                console.log('Token Debug: ', token);
                const platformName = process.env.E_CLASS_PLATFORM_SHORT_NAME
                if (!platformName) {
                    throw new Error("CRITICAL! Configuration Error: Platform name not found in the environment variables");
                }
                const isValidPlatform = platform.PlatformSchema.safeParse(platformName);
                if (!isValidPlatform.success) {
                    // TODO log error
                    throw new Error(`Invalid platform name ${platformName}. Check the app configuration.`);
                }
                session.platform = platformName as platform.TPlatform;
    
                const nextAuthToken = token as DefaultJWT & {
                    user: TAuthProviderProfileDTO,
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
                const platformSpecificRoles = extractPlatformSpecificRoles(roles, platformName);
    
                if (session.user.roles === undefined || session.user.roles.length === 0) {
                    session.user.roles = ['visitor'];
                }
                const RoleSchema = role.RoleSchema;
    
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
    }

    if(config.useTestAccounts) {
        nextAuthConfig.providers.push(credentialsProvider);
    }
    return NextAuth(nextAuthConfig)
}