import { z } from 'zod';
import { UserSchema } from './user';
import { RoleSchema } from './role';

/**
 * Represents a user in the session object.
 */
export const SessionUserSchema = UserSchema.merge(z.object({
    accessToken: z.string(),
    idToken: z.string(),
    roles: z.array(RoleSchema),
})).partial();

export type TSessionUser = z.infer<typeof SessionUserSchema>;


export const SessionSchema = z.object({
    user: SessionUserSchema,
    expires: z.string(),
});

export type TSession = z.infer<typeof SessionSchema>;
