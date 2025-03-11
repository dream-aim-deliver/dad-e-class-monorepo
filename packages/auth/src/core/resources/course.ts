import { course } from '@maany_shr/e-class-models';
import { TAuthUser, TRoleWithResourcePermissions } from '../models';

export type TResourceName = "course";

/**
 * Represents the permissions for a resource.
 * 
 * @typedef {Object} TResourcePermission
 * @property {course.TCourseMetadata} dataType - The type of data associated with the resource.
 * @property {"read" | "update" | "delete"} action - The action that can be performed on the resource.
 */
export type TResourcePermission = {
    dataType: course.TCourseMetadata,
    action: |
    // Allows viewing or reading the data
    "read" | 
    // Allows modifying existing data
    "update" | 
    // Allows removing or deleting the data
    "delete",
}


/**
 * Defines the permission rules for different roles on the "course" resource.
 * 
 * @type {TRoleWithResourcePermissions<"course", course.TCourseMetadata, TResourcePermission>}
 */
const RULES: TRoleWithResourcePermissions<"course", course.TCourseMetadata, TResourcePermission> = {
    visitor: {
        course: {
            read: (user: TAuthUser, course) => {
                if (course.title === 'Public Course') {
                    return true;
                }
            },
            update: false,
            delete: false,
        }
    },
    student: {
        course: {
            read: true,
            update: false,
            delete: false,
        }
    },
    coach: {
        course: {
            read: true,
            update: (user: TAuthUser, course) => {
                return true;
            },
            delete: (user: TAuthUser, course) => {
                return false;
            }
        }
    },
    admin: {
        course: {
            read: true,
            update: true,
            delete: true,
        }
    }
}

export default RULES;