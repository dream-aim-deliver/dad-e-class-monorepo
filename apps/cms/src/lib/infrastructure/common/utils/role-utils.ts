/**
 * Role hierarchy utilities for user role management
 * Roles are ordered from lowest to highest privilege
 */

import { TEClassRole } from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Role hierarchy ordered from lowest to highest privilege
 */
export const ROLE_HIERARCHY: TEClassRole[] = [
  'visitor',
  'student',
  'coach',
  'course_creator',
  'admin',
  'superadmin',
];

/**
 * Map of role hierarchy levels for quick lookup
 */
const ROLE_HIERARCHY_MAP: Record<TEClassRole, number> = {
  visitor: 0,
  student: 1,
  coach: 2,
  course_creator: 3,
  admin: 4,
  superadmin: 5,
};

/**
 * Sort roles by hierarchy (lowest to highest privilege)
 * @param roles - Array of roles to sort
 * @returns Sorted array of roles
 */
export function sortRolesByHierarchy(roles: TEClassRole[]): TEClassRole[] {
  return [...roles].sort((a, b) => {
    const levelA = ROLE_HIERARCHY_MAP[a] ?? -1;
    const levelB = ROLE_HIERARCHY_MAP[b] ?? -1;
    return levelA - levelB;
  });
}

/**
 * Extract the highest role from an array of roles based on hierarchy
 * @param roles - Array of roles
 * @returns The highest privilege role, or null if no valid roles
 */
export function getHighestRole(roles: TEClassRole[]): TEClassRole | null {
  if (!roles || roles.length === 0) return null;

  let highestRole: TEClassRole | null = null;
  let highestLevel = -1;

  for (const role of roles) {
    const level = ROLE_HIERARCHY_MAP[role];
    if (level !== undefined && level > highestLevel) {
      highestLevel = level;
      highestRole = role;
    }
  }

  return highestRole;
}

/**
 * Check if a role is higher than another role in the hierarchy
 * @param role - The role to check
 * @param compareRole - The role to compare against
 * @returns true if role is higher than compareRole
 */
export function isRoleHigherThan(role: TEClassRole, compareRole: TEClassRole): boolean {
  const roleLevel = ROLE_HIERARCHY_MAP[role] ?? -1;
  const compareLevel = ROLE_HIERARCHY_MAP[compareRole] ?? -1;
  return roleLevel > compareLevel;
}

/**
 * Get the role hierarchy level
 * @param role - The role to get the level for
 * @returns The hierarchy level (0-5), or -1 if invalid role
 */
export function getRoleLevel(role: TEClassRole): number {
  return ROLE_HIERARCHY_MAP[role] ?? -1;
}

/**
 * Translation key mapping for roles
 * Maps role names to their translation keys in common.roles
 */
const ROLE_TRANSLATION_KEYS: Record<TEClassRole, string> = {
  visitor: 'visitor',
  student: 'student',
  coach: 'coach',
  course_creator: 'course_creator',
  admin: 'admin',
  superadmin: 'superadmin',
};

/**
 * Get the translated role name for a given role and locale
 * This is a helper to centralize role translation logic
 *
 * @param role - The role to translate (e.g., 'course_creator')
 * @param locale - The locale code ('en', 'de')
 * @returns The translated role name
 *
 * @example
 * ```typescript
 * import { EN, DE } from '@maany_shr/e-class-translations';
 *
 * const enRoleName = getRoleTranslation('course_creator', EN);
 * // Returns: "Course Creator"
 *
 * const deRoleName = getRoleTranslation('course_creator', DE);
 * // Returns: "Kursersteller"
 * ```
 */
export function getRoleTranslation(role: TEClassRole, locale: { common: { roles: Record<string, string> } }): string {
  const translationKey = ROLE_TRANSLATION_KEYS[role];
  return locale.common.roles[translationKey] || role;
}
