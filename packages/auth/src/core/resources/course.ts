import { course } from '@maany_shr/e-class-models';
import { TAuthUserInfo, TRoleWithResourcePermissions } from '../entity/models';

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
            read: (_user: TAuthUserInfo, course) => {
                if (course.title === 'Public Course') {
                    return true;
                }
                return false;
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
            update: true,
            delete: false
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