/**
 * @fileoverview Defines the schema and type for the user object used in authentication and authorization contexts.
 * 
 * This module imports necessary schemas from external packages and uses Zod to define the structure of the AuthUser object.
 * 
 * @packageDocumentation
 */

import { z } from 'zod';
import { profile, course } from '@maany_shr/e-class-models';

/**
 * Schema for the user object used in authentication and authorization contexts.
 * 
 * The AuthUserSchema defines the structure of the user object, which includes:
 * - `roles`: An array of strings representing the roles assigned to the user.
 * - `profile`: A profile object conforming to the BasePersonalProfileSchema from the e-class-models package.
 * 
 * @example
 * const user = {
 *   roles: ['admin', 'user'],
 *   profile: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com',
 *     // other profile fields...
 *   }
 * };
 * 
 * const parsedUser = AuthUserSchema.parse(user);
 * 
 * @see {@link https://github.com/maany_shr/e-class-models} for more details on the profile schema.
 */
export const AuthUserSchema = z.object({
    roles: z.array(z.string()),
    profile: profile.BasePersonalProfileSchema,
});

/**
 * Type definition for the user object used in authentication and authorization contexts.
 * 
 * This type is inferred from the AuthUserSchema and represents the shape of the user object.
 * 
 * @typedef {Object} TAuthUser
 * @property {string[]} roles - An array of strings representing the roles assigned to the user.
 * @property {BasePersonalProfileSchema} profile - A profile object conforming to the BasePersonalProfileSchema from the e-class-models package.
 */
export type TAuthUser = z.infer<typeof AuthUserSchema>;



type TPermissionCheck<Key extends keyof TPermission> =
    | boolean
    | ((user: TAuthUser, data: TPermission[Key]["dataType"]) => boolean)



export type TAuthResources = "course" | "profile";


type TPermission = {
    [key in TAuthResources]: {
        dataType: z.ZodObject<any>,
        action: z.ZodEnum<[string, ...string[]]>,
    }
}

export abstract class BaseAuthResource{
    constructor(public dataType: z.ZodObject<any>, public actions: z.ZodEnum<[string, ...string[]]>){}
}