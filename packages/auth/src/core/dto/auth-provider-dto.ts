import { z } from 'zod';
import { role } from '@maany_shr/e-class-models';


/**
 * Schema for the authentication provider profile.
 * This is a DTO. SSO Providers will have their own database of users. After querying the provider, the response will be mapped to this schema.
 * This schema defines the structure of the profile information
 * provided by an authentication provider.
 * 
 * @property {string} provider - The name of the authentication provider.
 * @property {string} externalID - The external identifier provided by the authentication provider.
 * @property {string} name - The full name of the user.
 * @property {string} nickname - The nickname or username of the user.
 * @property {string} sub - The subject identifier.
 * @property {string} email - The email address of the user.
 * @property {string} image - The URL to the user's profile image.
 * @property {string} sid - The session identifier.
 * @property {string} issuer - The issuer of the authentication token.
 * @property {string} expires - The expiration time of the authentication token.
 * @property {RoleSchema[]} roles - The roles assigned to the user.
 * 
 * @example
 * In the next-auth provider 'profile' callback, the profile object is mapped to this schema:
 * ```typescript
 * const profile = {
 *    provider: 'auth0',
 *    externalID: `auth0|${profile.sub}`,
 *    name: profile.name,
 *    nickname: profile.nickname,
 *    sub: profile.sub,
 *    email: profile.email,
 *    image: profile.picture,
 *    sid: profile.sid,
 *    issuer: profile.iss,
 *    expires: profile.exp,
 *    roles: roles,
 * } as TAuthProviderProfile;
 * ```
 */
export const AuthProviderProfileDTOSchema = z.object({
    provider: z.string(),
    externalID: z.string(),
    name: z.string(),
    nickname: z.string(),
    sub: z.string(),
    email: z.string(),
    image: z.string(),
    sid: z.string(),
    issuer: z.string(),
    expires: z.string(),
    roles: z.array(role.RoleSchema),
});

/**
 * This is a DTO. SSO Providers will have their own database of users. After querying the provider, the response will be mapped to this schema.
 * This schema defines the structure of the profile information
 * provided by an authentication provider.
 * 
 * @property {string} provider - The name of the authentication provider.
 * @property {string} externalID - The external identifier provided by the authentication provider.
 * @property {string} name - The full name of the user.
 * @property {string} nickname - The nickname or username of the user.
 * @property {string} sub - The subject identifier.
 * @property {string} email - The email address of the user.
 * @property {string} image - The URL to the user's profile image.
 * @property {string} sid - The session identifier.
 * @property {string} issuer - The issuer of the authentication token.
 * @property {string} expires - The expiration time of the authentication token.
 * @property {RoleSchema[]} roles - The roles assigned to the user.
 * 
 * @example
 * In the next-auth provider 'profile' callback, the profile object is mapped to this schema:
 * ```typescript
 * const profile = {
 *    provider: 'auth0',
 *    externalID: `auth0|${profile.sub}`,
 *    name: profile.name,
 *    nickname: profile.nickname,
 *    sub: profile.sub,
 *    email: profile.email,
 *    image: profile.picture,
 *    sid: profile.sid,
 *    issuer: profile.iss,
 *    expires: profile.exp,
 *    roles: roles,
 * } as TAuthProviderProfile;
 * ```
 */
export type TAuthProviderProfileDTO = z.infer<typeof AuthProviderProfileDTOSchema>;