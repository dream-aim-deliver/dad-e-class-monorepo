import { role, auth } from "@maany_shr/e-class-models";
import { TSessionUser } from "packages/models/src/auth";

/**
 * Extracts platform-specific roles from a list of roles in the format `platform-{platform_name}:{role}.
 *
 * @param roles - An array of role strings.
 * @param platform - The platform prefix to filter roles by.
 * @returns An array of platform-specific roles as `TRole`.
 *
 * @remarks
 * This function filters the roles that start with the specified platform prefix,
 * removes the prefix, converts the remaining part to lowercase, and validates it
 * against the `RoleSchema`. If the validation fails, the role is set to 'visitor'.
 *
 * @example
 * ```typescript
 * const roles = ['platform-web:admin', 'platform-mobile:user', 'platform-mobile:admin'];
 * const platform = 'mobile';
 * const result = extractPlatformSpecificRoles(roles, platform);
 * // result: ['user', 'admin']
 * ```
 */
export const extractPlatformSpecificRoles = (roles: string[], platform: string): role.TRole[] => {
    const paltformRoles = roles.filter((role) => role.startsWith(`platform-${platform}`))
    return paltformRoles.map((platformRole): role.TRole => {
        const platformSpecificRole: role.TRole = platformRole.replace(`platform-${platform}:`, '').trim().toLowerCase() as role.TRole;
        const validationResponse = role.RoleSchema.safeParse(platformSpecificRole);
        if (!validationResponse.success) {
            console.error(`auth#extractPlatformSpecificRoles: Invalid role ${role}. Check the role configuration. Accepted values are ${role.RoleSchema.options.values}`);
            return 'visitor'
        }
        return platformSpecificRole
    });
};


/**
 * Interface representing an object that may have an optional session property.
 * This function is for the props of react components that need to be aware of the session.
 * @interface isSessionAware
 * @property {auth.TSession} [session] - Optional session object that contains authentication details.
 * 
 * @example
 * ```typescript
 * const MyComponent: React.FC<isSessionAware> = ({ session }) => {
 *    return (
 *       <div>
 *         {session ? <p>Welcome {session.user.name}</p> : <p>Not logged in</p>}
 *      </div>
 *   )
 * }
 * 
 */
export interface isSessionAware {
    session?: auth.TSession
}

/**
 * An array of test accounts used for authentication testing.
 * Each test account includes user details and a password.
 *
 * @constant
 * @type {Array<auth.TSessionUser & { password: string }>}
 *
 * It contains 4 test accounts with user details and password.
 * Conny is an admin, Wim is a coach, Divyanshu is a student, and Alice is a visitor.
 */
export const TEST_ACCOUNTS: (auth.TSessionUser & { password: string })[] = [
    {
        id: '1',
        name: 'Conny',
        email: 'conny@e-class-dev.com',
        roles: ['visitor', 'student', 'coach', 'admin'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
        
    },
    {
        id: '2',
        name: 'Wim',
        email: '',
        roles: ['visitor', 'student', 'coach'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
    },
    {
        id: '3',
        name: 'Divyanshu',
        email: '',
        roles: ['visitor', 'student'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
    },
    {
        id: '4',
        name: 'Alice',
        email: '',
        roles: ['visitor'],
        password: 'test',
    },
]

export const getTestAccount = (role: role.TRole): TSessionUser & { password: string } => {
    const conny = TEST_ACCOUNTS[0];
    const wim = TEST_ACCOUNTS[1];
    const divyanshu = TEST_ACCOUNTS[2];
    const alice = TEST_ACCOUNTS[3];
    switch (role) {
        case 'admin':
            return conny;
        case 'coach':
            return wim;
        case 'student':
            return divyanshu;
        default:
            return alice;
    }
}