import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_E_CLASS_RUNTIME: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_SHORT_NAME: z.string(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: z.string(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: z.string().url(),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
    NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL: z.string().url().optional(),
});

export { clientEnvSchema };
export type TEnv = z.infer<typeof clientEnvSchema>;


const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'development',
    NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ||
        'https://eclass-platform-assets.s3.eu-central-1.amazonaws.com/backgrounds/default-cms-background.jpg',
    NEXT_PUBLIC_E_CLASS_PLATFORM_SHORT_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_SHORT_NAME || 'dev',
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    NEXT_PUBLIC_E_CLASS_PLATFORM_URL: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL:
        process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_LOGO_URL ||
        'https://static.wixstatic.com/media/9fe096_91d65ad491464eff8da1c0b2973b3f79~mv2.png/v1/fill/w_110,h_110,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/BA_Kreis_pos_500px.png',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL: process.env.NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL,
};

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;