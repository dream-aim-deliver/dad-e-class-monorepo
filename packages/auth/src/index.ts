import { TRole } from './roles';
import CourseRules, { TResourcePermission as TCourseResourcePermission } from './core/resources/course';
import ProfileRules, {TResourcePermission as TProfileResourcePermission} from './core/resources/profile';
import { TAuthUser, TPermissionCheck } from './core/models';

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

export const AUTH_RULES: TAllRolesWithPermissions = {
    ...CourseRules,
    ...ProfileRules
};

export function hasPermission<TResource extends keyof TPermission>(
    user: TAuthUser,
    resource: TResource,
    action: TPermission[TResource]["action"],
    data?: TPermission[TResource]["dataType"]
) {
    return user.roles.some(role => {
        const permission = (AUTH_RULES as TAllRolesWithPermissions)[role][resource]?.[action]
        if (permission == null) return false

        if (typeof permission === "boolean") return permission
        return data != null && permission(user, data)
    })
}
