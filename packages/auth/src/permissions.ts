import { z } from 'zod';
import { profile, course } from '@maany_shr/e-class-models';

const UserSchema = z.object({
    roles: z.array(z.string()),
    profile: profile.BasePersonalProfileSchema,
});

type TUser = z.infer<typeof UserSchema>;

const RoleSchema = z.enum(['visitor', 'student', 'coach', 'admin']);
type TRole = z.infer<typeof RoleSchema>;

const PermissionSchema = z.object({
    course: z.object({
        dataType: course.CourseMetadataSchema,
        action: z.enum(['read', 'write', 'delete']),
    }),
});

type TPermission = z.infer<typeof PermissionSchema>;

const resourceKeys = Object.keys(PermissionSchema.shape) as [keyof typeof PermissionSchema.shape];
export const AuthResourceSchema = z.enum(resourceKeys);
export type TAuthResource = z.infer<typeof AuthResourceSchema>;

type TPermissionCheck<Key extends keyof TPermission> =
    | boolean
    | ((user: TUser, data: TPermission[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
    [R in TRole]: Partial<{
        [Key in keyof TPermission]: Partial<{
            [Action in TPermission[Key]["action"]]: TPermissionCheck<Key>
        }>
    }>
}

const RULES: RolesWithPermissions = {
    visitor: {
        course: {
            read: (user, course) => {
                if (course.title === 'Public Course') {
                    return true;
                }

            },
            write: false,
            delete: false,
        }
    },
    student: {},
    coach: {},
    admin: {},
}

