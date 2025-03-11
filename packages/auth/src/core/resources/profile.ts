import { profile } from '@maany_shr/e-class-models';
import { TAuthUser, TRoleWithResourcePermissions } from '../models';
export type TResourceName = "profile";

/**
 * Represents the permissions for a resource.
 * 
 * @typedef {Object} TResourcePermission
 * @property {profile.TProfiles} dataType - The type of profile data.
 * @property {"read" | "update" | "delete"} action - The action that can be performed on the resource.
 */
export type TResourcePermission = {
    dataType: profile.TProfiles,
    action: "read" | "update" | "delete",
}

/**
 * Defines the permission rules for different roles on the "profile" resource.
 * 
 * @type {TRoleWithResourcePermissions<"profile", profile.TProfiles, TResourcePermission>}

 */
const RULES: TRoleWithResourcePermissions<"profile", profile.TProfiles, TResourcePermission> = {
    visitor: {
        profile: {
            read: true,
            update: false,
            delete: false,
        }
    },
    student: {
        profile: {
            read: true,
            update: false,
            delete: false,
        }
    },
    coach: {
        profile: {
            read: true,
            update: (user: TAuthUser, profile) => {
                const personalProfile = profile[0] as profile.TPersonalProfile;
                return user.profile.email === personalProfile.email;
            },
            delete: false,
        }
    },
    admin: {
        profile:
        {
            read: true,
            update: true,
            delete: true,
        }
    }
}

export default RULES;