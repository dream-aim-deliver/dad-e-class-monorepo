import { z } from 'zod';

export const UserSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

export type TUser = z.infer<typeof UserSchema>;

export const GroupSchema = z.object({
    name: z.string(),
    users: z.array(UserSchema),
});
export type TGroup = z.infer<typeof GroupSchema>;

// TODO move to a separate file
export const ResourceTypeSchema = z.enum(['user', 'course']);
export type TResourceType = z.infer<typeof ResourceTypeSchema>;

export const BaseResourceSchema = z.object({
    type: ResourceTypeSchema,
});

export const UserPermissionSchema = z.object({
    resource: BaseResourceSchema,
    type: z.literal('user'),
    user: UserSchema,
    actions: z.array(z.string()),
});

export type TUserPermission = z.infer<typeof UserPermissionSchema>;

export const GroupPermissionSchema = z.object({
    resource: BaseResourceSchema,
    type: z.literal('group'),
    group: GroupSchema,
    actions: z.array(z.string()),
});

export type TGroupPermission = z.infer<typeof GroupPermissionSchema>;

export const PermissionSchema = z.discriminatedUnion("type", [UserPermissionSchema, GroupPermissionSchema]);
export type TPermission = z.infer<typeof PermissionSchema>;

export const StudentSchema = z.object({
    user: UserSchema,
    group: GroupSchema,
});

export const CoachSchema = z.object({
});