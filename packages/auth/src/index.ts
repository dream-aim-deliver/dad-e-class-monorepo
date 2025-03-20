import { TPermissionCheck } from './core/entity';
import CourseRules, { TResourcePermission as TCourseResourcePermission } from './core/resources/course';
import ProfileRules, { TResourcePermission as TProfileResourcePermission } from './core/resources/profile';
import { role, auth } from '@maany_shr/e-class-models';

export {AuthProviderProfileDTOSchema, type TAuthProviderProfileDTO } from './core/dto/auth-provider-dto';
export {GetSessionDTOSchema, type TGetSessionDTO, ExtractJWTDTOSchema, type TExtractJWTDTO} from './core/dto/auth-gateway-dto';
export { type AuthGatewayOutputPort} from './core/ports/secondary/auth-gateway-output-port';
export { NextAuthGateway } from './infrastructure/gateway/next-auth-gateway';
export { generateNextAuthConfig } from './infrastructure/config/next-auth.config';
export { type isSessionAware, extractPlatformSpecificRoles, getTestAccount } from './infrastructure/utils';

interface TPermission {
    course: TCourseResourcePermission
    profile: TProfileResourcePermission
}

type TAllRolesWithPermissions = {
    [R in role.TRole]: Partial<{
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
 * @param {TAuthUserInfo} user - The user whose permissions are being checked.
 * @param {TResource} resource - The resource on which the action is to be performed.
 * @param {TPermission[TResource]["action"]} action - The action to be performed on the resource.
 * @param {TPermission[TResource]["dataType"]} [data] - Optional data required for the permission check.
 * @returns {boolean} - Returns `true` if the user has the required permission, otherwise `false`.
 */
export function hasPermission<TResource extends keyof TPermission>(
    user: auth.TSessionUser,
    resource: TResource,
    action: TPermission[TResource]["action"],
    data?: TPermission[TResource]["dataType"]
) {
    if (user.roles == null || user.roles.length === 0) return false
    return user.roles.some((role: role.TRole) => {
        const typedRole = role as role.TRole;
        const permission = (AUTH_RULES as TAllRolesWithPermissions)[typedRole][resource]?.[action]
        if (permission == null) return false
        if (typeof permission === "boolean") return permission
        return data != null && permission(user, data)
    })
}
