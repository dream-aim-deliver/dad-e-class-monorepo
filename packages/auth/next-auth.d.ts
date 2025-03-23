import NextAuth from "next-auth"
import { auth } from "@maany_shr/e-class-models"
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
     
    interface Session extends auth.TSession {
        user: auth.TSessionUser;
    }

    // Optionally, override the User type
    // interface User {
    //   // ...other properties
    //   role: "user" | "admin";
    // }
}
