import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_E_CLASS_RUNTIME: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: z.string().url(),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
    // NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL: z.string().url().optional(),
    // OpenTelemetry Browser Configuration
    NEXT_PUBLIC_OTEL_ENABLED: z.string().optional(),
    NEXT_PUBLIC_OTEL_SERVICE_NAME: z.string().optional(),
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

export { clientEnvSchema };
export type TEnv = z.infer<typeof clientEnvSchema>;

// During Docker build, env vars may not be available yet (they're injected at runtime by PM2)
// So we provide placeholder values during build that will be overridden at runtime
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || (isBuildTime ? 'build-time@placeholder.com' : undefined),
    // NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL: process.env.NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL,
    // OpenTelemetry Browser Configuration
    NEXT_PUBLIC_OTEL_ENABLED: process.env.NEXT_PUBLIC_OTEL_ENABLED,
    NEXT_PUBLIC_OTEL_SERVICE_NAME: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'e-class-cms-browser',
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT,
};

const envValidationResult = clientEnvSchema.safeParse(runtimeEnv);
if (!envValidationResult.success) {
    throw new Error(
        "❌ Invalid environment variables: " +
            JSON.stringify(envValidationResult.error.format(), null, 4),
    );
}

export default envValidationResult.data;