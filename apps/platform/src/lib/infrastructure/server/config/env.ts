import { z } from 'zod';
import { clientEnvSchema } from '../../client/config/env';

const serverEnvSchema = clientEnvSchema.merge(z.object({
    AUTH_SECRET: z.string().min(1),
    AUTH_ENABLE_TEST_ACCOUNTS: z.boolean(),
    AUTH_AUTH0_CLIENT_ID: z.string().min(1),
    AUTH_AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH_AUTH0_ISSUER: z.string().url(),
    AUTH_AUTH0_AUTHORIZATION_URL: z.string().url(),
    AUTH_AUTH0_ROLES_CLAIM: z.string().min(1),
    AUTH_AUTH0_ROLES_CLAIM_KEY: z.string().min(1),
    E_CLASS_PLATFORM_SHORT_NAME: z.string(),
    E_CLASS_PLATFORM_NAME: z.string(),
    E_CLASS_DEV_MODE: z.boolean(),
    E_CLASS_PLATFORM_ID: z.string(),
}));

export type TEnv = z.infer<typeof serverEnvSchema>;

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_PLATFORM_SHORT_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_SHORT_NAME || 'dev',
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    NEXT_PUBLIC_E_CLASS_PLATFORM_URL:
        process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL:
        process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL ||
        'https://static.wixstatic.com/media/9fe096_91d65ad491464eff8da1c0b2973b3f79~mv2.png/v1/fill/w_110,h_110,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/BA_Kreis_pos_500px.png',
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ENABLE_TEST_ACCOUNTS:
        process.env.AUTH_ENABLE_TEST_ACCOUNTS?.trim().toLowerCase() === 'true',
    AUTH_AUTH0_CLIENT_ID: process.env.AUTH_AUTH0_CLIENT_ID,
    AUTH_AUTH0_CLIENT_SECRET: process.env.AUTH_AUTH0_CLIENT_SECRET,
    AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER,
    AUTH_AUTH0_AUTHORIZATION_URL: process.env.AUTH_AUTH0_AUTHORIZATION_URL,
    AUTH_AUTH0_ROLES_CLAIM: process.env.AUTH_AUTH0_ROLES_CLAIM,
    AUTH_AUTH0_ROLES_CLAIM_KEY: process.env.AUTH_AUTH0_ROLES_CLAIM_KEY,
    E_CLASS_PLATFORM_SHORT_NAME: process.env.E_CLASS_PLATFORM_SHORT_NAME || 'dev',
    E_CLASS_PLATFORM_NAME: process.env.E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    E_CLASS_DEV_MODE:
        process.env.E_CLASS_DEV_MODE?.trim().toLowerCase() === 'true',
    E_CLASS_PLATFORM_ID: process.env.E_CLASS_PLATFORM_ID || '1',
};

const envValidationResult = serverEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;