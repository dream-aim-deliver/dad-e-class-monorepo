/**
 * Course / group management roles that may oversee groups without
 * redeeming a group coupon (i.e. without becoming a group coach).
 *
 * Coupon-based coach membership remains the only path for the coach role.
 */
export const COURSE_GROUP_MANAGER_ROLES = [
    'superadmin',
    'admin',
    'course_creator',
] as const;

export type TCourseGroupManagerRole =
    (typeof COURSE_GROUP_MANAGER_ROLES)[number];

export function isCourseGroupManagerRole(
    role: string | null | undefined,
): boolean {
    if (!role) return false;
    return (COURSE_GROUP_MANAGER_ROLES as readonly string[]).includes(role);
}

/** Session may list multiple roles; any manager role grants oversight access. */
export function hasCourseGroupManagerRole(
    roles: string[] | null | undefined,
): boolean {
    if (!roles?.length) return false;
    return roles.some((role) => isCourseGroupManagerRole(role));
}

/** Coach workspace: group coaches OR course managers (admin path). */
export function canAccessCoachGroupWorkspace(
    roles: string[] | null | undefined,
): boolean {
    if (!roles?.length) return false;
    return roles.includes('coach') || hasCourseGroupManagerRole(roles);
}
