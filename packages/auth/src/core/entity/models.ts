import { z } from 'zod';
import { profile } from '@maany_shr/e-class-models';
import { RoleSchema, TRole } from './roles';

export const AuthUserSchema = z.object({
    roles: z.array(z.string()),
    groups: z.array(z.string()),
    profile: profile.BasePersonalProfileSchema,
});

export type TAuthUser = z.infer<typeof AuthUserSchema>;

export type TPermissionCheck<TZodSchema> = boolean | ((user: TAuthUser, data: TZodSchema) => boolean);

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

/**
 * Represents a session object.
 */
export const SessionSchema = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string(),
        role: RoleSchema,
    }),
});

export type TSession = z.infer<typeof SessionSchema>;
