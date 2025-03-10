import { z } from 'zod';

/**
 * Creates a Zod schema for roles.
 * These roles are configured in the external authentication provider databases like Auth0 or can be internally stored in the database of the application.
 * 
 * @param roles - A list of strings representing the roles that can be assigned to a user. 
 * @returns A Zod enum schema for the provided roles.
 * 
 * @example
 * ```typescript
 * const RoleSchema = RoleSchemaFactory(['visitor', 'student', 'coach', 'admin']);
 * type TRole = z.infer<typeof RoleSchema>;
 * ``` 
 */
export const RoleSchemaFactory: (roles: string[]) => z.ZodEnum<[string, ...string[]]> = (roles) => z.enum(roles as [string, ...string[]]);

export const PermissionDataSchema = z.object({
    dataType: z.any(),
    action: z.enum(["read", "write", "delete"]),
});

export const PermissionSchemaFactory = (dataType: z.ZodObject<any>, actions: z.ZodEnum<[string, ...string[]]>) => {
    return z.object({
        dataType,
        action: actions,
    });
}

const RoleSchema = RoleSchemaFactory(["visitor", "student", "coach", "admin"]);
const CoursePermissionsSchema = PermissionSchemaFactory(z.object({
    title: z.string(),
    description: z.string(),
}), z.enum(["read", "write", "delete"]));

const PemrissionSchema = z.object({
    course: CoursePermissionsSchema,
});

type TPermission = z.infer<typeof PemrissionSchema>;

// /**
//  * Creates a Zod schema for authentication resources.
//  *
//  * @param resources - A list of strings representing the resources that can be assigned to a user. These resources are configured in the external authentication provider databases or can be internally stored in the database of the application.
//  * @returns A Zod enum schema for the provided resources.
//  */
// export const AuthResourceSchemaFactory: (resources: string[]) => z.ZodEnum<[string, ...string[]]>;

// /**
//  * Creates a Zod schema for permissions.
//  *
//  * @returns A Zod object schema for permissions.
//  */
// export const PermissionSchemaFactory: () => z.ZodObject<{}>;
