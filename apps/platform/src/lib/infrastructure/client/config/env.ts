import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_E_CLASS_RUNTIME: z.string(),
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: z.string().url(),
    // OpenTelemetry Browser Configuration
    NEXT_PUBLIC_OTEL_ENABLED: z.string().optional(),
    NEXT_PUBLIC_OTEL_SERVICE_NAME: z.string().optional(),
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});

export { clientEnvSchema };
export type TEnv = z.infer<typeof clientEnvSchema>;

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'e-class-dev',
    NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: process.env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME || 'E-Class Platform',
    NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    // OpenTelemetry Browser Configuration
    NEXT_PUBLIC_OTEL_ENABLED: process.env.NEXT_PUBLIC_OTEL_ENABLED,
    NEXT_PUBLIC_OTEL_SERVICE_NAME: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'e-class-platform-browser',
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
};

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;