import { course } from '@maany_shr/e-class-models';
import { TAuthUser, TRoleWithResourcePermissions } from '../models';

export type TResourceName = "course";

export type TResourcePermission = {
    dataType: course.TCourseMetadata,
    action: "read" | "update" | "delete",
}


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