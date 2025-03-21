import { auth, role } from '@maany_shr/e-class-models';


/**
 * Represents a permission check for a resource.
 *
 * @template TZodSchema - The schema type for the data associated with the permission.
 * 
 * @typedef {boolean | ((user: auth.TSessionUser, data: TZodSchema) => boolean)} TPermissionCheck
 * @property {boolean} boolean - A boolean value representing the permission check.
 * @property {(user: auth.TSessionUser, data: TZodSchema) => boolean} function - A function that takes a user and data and returns a boolean.
 * 
 * @example
 * const permissionCheck: TPermissionCheck<course.TCourseMetadata> = (user, course) => {
 *    if (course.title === 'Public Course') {
 *        return true;
 *    }
 *    return false;
 * }
 */
export type TPermissionCheck<TZodSchema> = boolean | ((user: auth.TSessionUser, data: TZodSchema) => boolean);

/**
 * Represents a resource permission with a specific data type and action.
 *
 * @template TZodSchema - The schema type for the data associated with the permission.
 * @property {TZodSchema} dataType - The schema type for the data associated with the permission.
 * @property {string} action - The action that is permitted on the resource.
 * 
 * @example
 * const permission: TResourcePermission<course.TCourseMetadata> = {
 *    dataType: course.TCourseMetadata,
 *    action: "read" | "update" | "delete",
 * }
 */
type TResourcePermission<TZodSchema> = {
    dataType: TZodSchema,
    action: string,
}

/**
 * Represents a mapping of roles to resources and their associated permissions.
 *
 * @template TResource - The type representing the resource as a string.
 * @template TZodSchema - The Zod schema type used for validation.
 * @template TPermission - The type representing the resource permission.
 *
 * @typedef {Object} TRoleWithResourcePermissions
 * @property {Object} [R in role.TRole] - An object where each key is a role.
 * @property {Object} [K in TResource] - An object where each key is a resource.
 * @property {Object} [Action in TPermission["action"]] - An object where each key is an action.
 * @property {TPermissionCheck<TZodSchema>} TPermissionCheck - The permission check associated with the action.
 * 
 * @example
 * const RULES: TRoleWithResourcePermissions<"course", course.TCourseMetadata, TResourcePermission> = {
 *    visitor: {
 *       course: {
 *          read: (_user: auth.TSessionUser, course) => {
 *            if (course.title === 'Public Course') {
 *                 return true;
 *            }
 *            return false;
 *          },
 *          update: false,
 *          delete: false,
 *       }
 *    }
 * }
 *
 */
export type TRoleWithResourcePermissions<TResource extends string, TZodSchema, TPermission extends TResourcePermission<TZodSchema>> = {
    [R in role.TRole]: {
        [K in TResource]: {
            [Action in TPermission["action"]]: TPermissionCheck<TZodSchema>
        }
    }
}