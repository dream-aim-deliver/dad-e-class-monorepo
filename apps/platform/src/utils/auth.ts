import NextAuth, { NextAuthResult } from "next-auth"
import Auth0 from "next-auth/providers/auth0"

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
                    scope: "openid profile email",
                },
                url: process.env.AUTH_AUTH0_AUTHORIZATION_URL,
            },
            profile: (profile) => {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    sid: profile.sid,
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user, account, profile }) => {
            user && (token.user = user)
            return token;
        },
        session: ({ session, token }) => {
            // console.log("initial session", session);
            // token.user &&  (session.user = token.user);
            // const validationResponse = SessionSchema.safeParse(session);
            // if (!validationResponse.success) {
            //   throw new Error("Session schema validation failed");
            // }
            // console.log("final session", session);
      
            return session;
          },
    }
})

 export default nextAuth
