import { TDictionary } from "@maany_shr/e-class-translations";

declare global {
    interface IntlMessages extends TDictionary {}
}

import NextAuth from "next-auth"
import type { TSession, TSessionUser } from "@maany_shr/e-class-auth"
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Session extends TSession {
        user: TSessionUser;
    }

    // Optionally, override the User type
    // interface User {
    //   // ...other properties
    //   role: "user" | "admin";
    // }
}
