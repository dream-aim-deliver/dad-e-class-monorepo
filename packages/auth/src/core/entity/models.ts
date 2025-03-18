import { z } from 'zod';
import { RoleSchema, TRole } from './roles';
import { PlatformSchema } from './platforms';

/**
 * This is a DTO. SSO Providers will have their own database of users. After querying the provider, the response will be mapped to this schema.
 */
export const AuthProviderProfileSchema = z.object({
    provider: z.string(),
    externalID: z.string(),
    name: z.string(),
    nickname: z.string(),
    sub: z.string(),
    email: z.string(),
    image: z.string(),
    sid: z.string(),
    issuer: z.string(),
    expires: z.string(),
    roles: z.array(RoleSchema),
});


export type TAuthProviderProfile = z.infer<typeof AuthProviderProfileSchema>;

/**
 * This information is fetched from the managed DB instead of the SSO provider.
 */
export const AuthUserInfoSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    image: z.string(),
});

export type TAuthUserInfo = z.infer<typeof AuthUserInfoSchema>;


/**
 * Represents a user in the session object.
 */
export const SessionUserSchema = z.object({
    info: AuthUserInfoSchema,
    accessToken: z.string(),
    idToken: z.string(),
    roles: z.array(RoleSchema),
}).partial();

export type TSessionUser = z.infer<typeof SessionUserSchema>;


export const SessionSchema = z.object({
    isLoggedIn: z.boolean(),
    user: SessionUserSchema,
    platform: PlatformSchema,
    expires: z.date().and(z.string()),
});

export type TSession = z.infer<typeof SessionSchema>;

export type TPermissionCheck<TZodSchema> = boolean | ((user: TSessionUser, data: TZodSchema) => boolean);

type TResourcePermission<TZodSchema> = {
    dataType: TZodSchema,
    action: string,
}

export type TRoleWithResourcePermissions<TResource extends string, TZodSchema, TPermission extends TResourcePermission<TZodSchema>> = {
    [R in TRole]: {
        [K in TResource]: {
            [Action in TPermission["action"]]: TPermissionCheck<TZodSchema>
        }
    }
}