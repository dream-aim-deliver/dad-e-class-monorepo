import { TAuthUser, TPermissionCheck } from './core/entity/models';
import CourseRules, { TResourcePermission as TCourseResourcePermission } from './core/resources/course';
import ProfileRules, {TResourcePermission as TProfileResourcePermission} from './core/resources/profile';
import { TRole } from './core/entity/roles';

interface TPermission {
    course: TCourseResourcePermission
    profile: TProfileResourcePermission
} 

type TAllRolesWithPermissions = {
    [R in TRole]: Partial<{
        [Key in keyof TPermission]: Partial<{
            [Action in TPermission[Key]["action"]]: TPermissionCheck<TPermission[Key]["dataType"]>
        }>
    }>
}

/**
 * A constant object that combines authentication rules from all Resources.
 * This object represents all roles with their respective permissions.
 *
 * @constant
 * @type {TAllRolesWithPermissions}
 */
export const AUTH_RULES: TAllRolesWithPermissions = {
    ...CourseRules,
    ...ProfileRules
};

/**
 * Checks if a user has permission to perform a specific action on a resource.
 *
 * @template TResource - The type of the resource.
 * @param {TAuthUser} user - The user whose permissions are being checked.
 * @param {TResource} resource - The resource on which the action is to be performed.
 * @param {TPermission[TResource]["action"]} action - The action to be performed on the resource.
 * @param {TPermission[TResource]["dataType"]} [data] - Optional data required for the permission check.
 * @returns {boolean} - Returns `true` if the user has the required permission, otherwise `false`.
 */
export function hasPermission<TResource extends keyof TPermission>(
    user: TAuthUser,
    resource: TResource,
    action: TPermission[TResource]["action"],
    data?: TPermission[TResource]["dataType"]
) {
    if (user.roles == null || user.roles.length === 0) return false
    return user.roles.some((role) => {
        const typedRole = role as TRole;
        const permission = (AUTH_RULES as TAllRolesWithPermissions)[typedRole][resource]?.[action]
        if (permission == null) return false
        if (typeof permission === "boolean") return permission
        return data != null && permission(user, data)
    })
}
