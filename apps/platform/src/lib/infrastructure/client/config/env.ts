import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_E_CLASS_RUNTIME: z.string(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
    NEXT_PUBLIC_CONTACT_PHONE: z.string().optional(),
});

export { clientEnvSchema };
export type TEnv = z.infer<typeof clientEnvSchema>;

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'e-class-dev',
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
};

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;