import { TRole, RoleSchema} from "../core/entity/roles";

/**
 * Extracts platform-specific roles from a list of roles in the format `platform-{platform_name}:{role}.
 *
 * @param roles - An array of role strings.
 * @param platform - The platform prefix to filter roles by.
 * @returns An array of platform-specific roles as `TRole`.
 *
 * @remarks
 * This function filters the roles that start with the specified platform prefix,
 * removes the prefix, converts the remaining part to lowercase, and validates it
 * against the `RoleSchema`. If the validation fails, the role is set to 'visitor'.
 *
 * @example
 * ```typescript
 * const roles = ['admin-web', 'user-mobile', 'admin-mobile'];
 * const platform = 'mobile';
 * const result = extractPlatformSpecificRoles(roles, platform);
 * // result: ['user', 'admin']
 * ```
 */
export const extractPlatformSpecificRoles = (roles: string[], platform: string): TRole[] => {
    const paltformRoles = roles.filter((role) => role.startsWith(`platform-${platform}`))
    return paltformRoles.map((role): TRole => {
        const platformSpecificRole: TRole = role.replace(`platform-${platform}:`, '').trim().toLowerCase() as TRole;
        const validationResponse = RoleSchema.safeParse(platformSpecificRole);
        if (!validationResponse.success) {
            console.error(`auth#extractPlatformSpecificRoles: Invalid role ${role}. Check the role configuration. Accepted values are ${RoleSchema.options.values}`);
            return 'visitor'
        }
        return platformSpecificRole
    });
};