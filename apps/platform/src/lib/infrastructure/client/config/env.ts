import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_E_CLASS_RUNTIME: z.string(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: z.string().url(),
});

export { clientEnvSchema };
export type TEnv = z.infer<typeof clientEnvSchema>;

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'e-class-dev',
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
};

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;