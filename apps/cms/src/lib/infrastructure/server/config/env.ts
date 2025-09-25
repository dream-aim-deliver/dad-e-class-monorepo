import { z } from 'zod';
import { clientEnvSchema } from '../../client/config/env';

const serverEnvSchema = clientEnvSchema.merge(z.object({
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_AUTH0_CLIENT_ID: z.string().min(1),
    AUTH_AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH_AUTH0_ISSUER: z.string().url(),
    AUTH_AUTH0_AUTHORIZATION_URL: z.string().url(),
    AUTH_ENABLE_TEST_ACCOUNTS: z.boolean(),
    E_CLASS_DEV_MODE: z.boolean(),
    S3_HOSTNAME: z.string().min(1),
    S3_PORT: z.string().min(1),
    S3_PROTOCOL: z.enum(['http', 'https']),
}));

export type TEnv = z.infer<typeof serverEnvSchema>;

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'cms',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL:
        process.env.NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_AUTH0_CLIENT_ID: process.env.AUTH_AUTH0_CLIENT_ID,
    AUTH_AUTH0_CLIENT_SECRET: process.env.AUTH_AUTH0_CLIENT_SECRET,
    AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER,
    AUTH_AUTH0_AUTHORIZATION_URL:
        process.env.AUTH_AUTH0_AUTHORIZATION_URL,
    AUTH_ENABLE_TEST_ACCOUNTS:
        process.env.AUTH_ENABLE_TEST_ACCOUNTS?.trim().toLowerCase() === 'true',
    E_CLASS_DEV_MODE:
        process.env.E_CLASS_DEV_MODE?.trim().toLowerCase() === 'true',
    S3_HOSTNAME: process.env.S3_HOSTNAME,
    S3_PORT: process.env.S3_PORT,
    S3_PROTOCOL: process.env.S3_PROTOCOL === 'https' ? 'https' : 'http',
};

const envValidationResult = serverEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
  throw new Error(
    "❌ Invalid environment variables: " +
      JSON.stringify(envValidationResult.error.format(), null, 4),
  );
}

export default envValidationResult.data;