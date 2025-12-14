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
    E_CLASS_CMS_REST_URL: z.string().url().optional(),
    S3_HOSTNAME: z.string().min(1),
    S3_PORT: z.string().min(1),
    S3_PROTOCOL: z.enum(['http', 'https']),
    // OpenTelemetry Configuration
    OTEL_ENABLED: z.boolean().optional(),
    OTEL_SERVICE_NAME: z.string().optional(),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
}));

export type TEnv = z.infer<typeof serverEnvSchema>;

// During Docker build, env vars may not be available yet (they're injected at runtime by PM2)
// So we provide placeholder values during build that will be overridden at runtime
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

const runtimeEnv = {
    NEXT_PUBLIC_E_CLASS_RUNTIME: process.env.NEXT_PUBLIC_E_CLASS_RUNTIME || 'cms',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_E_CLASS_CMS_REST_URL: process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL || 'http://localhost:5173',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || (isBuildTime ? 'build-time@placeholder.com' : undefined),
    // NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL: process.env.NEXT_PUBLIC_CMS_BACKGROUND_IMAGE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || (isBuildTime ? 'http://localhost:3000' : undefined),
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || (isBuildTime ? 'build-time-placeholder' : undefined),
    AUTH_SECRET: process.env.AUTH_SECRET || (isBuildTime ? 'build-time-placeholder' : undefined),
    AUTH_AUTH0_CLIENT_ID: process.env.AUTH_AUTH0_CLIENT_ID || (isBuildTime ? 'build-time-placeholder' : undefined),
    AUTH_AUTH0_CLIENT_SECRET: process.env.AUTH_AUTH0_CLIENT_SECRET || (isBuildTime ? 'build-time-placeholder' : undefined),
    AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER || (isBuildTime ? 'https://build-time.placeholder.com' : undefined),
    AUTH_AUTH0_AUTHORIZATION_URL: process.env.AUTH_AUTH0_AUTHORIZATION_URL || (isBuildTime ? 'https://build-time.placeholder.com/authorize' : undefined),
    AUTH_ENABLE_TEST_ACCOUNTS:
        process.env.AUTH_ENABLE_TEST_ACCOUNTS?.trim().toLowerCase() === 'true',
    E_CLASS_DEV_MODE:
        process.env.E_CLASS_DEV_MODE?.trim().toLowerCase() === 'true',
    E_CLASS_CMS_REST_URL: process.env.E_CLASS_CMS_REST_URL,
    S3_HOSTNAME: process.env.S3_HOSTNAME || (isBuildTime ? 'localhost' : undefined),
    S3_PORT: process.env.S3_PORT || (isBuildTime ? '9000' : undefined),
    S3_PROTOCOL: process.env.S3_PROTOCOL === 'https' ? 'https' : 'http',
    // OpenTelemetry Configuration (Server)
    OTEL_ENABLED: process.env.OTEL_ENABLED?.trim().toLowerCase() === 'true',
    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME || 'e-class-cms',
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    // OpenTelemetry Configuration (Browser - from client schema)
    NEXT_PUBLIC_OTEL_ENABLED: process.env.NEXT_PUBLIC_OTEL_ENABLED,
    NEXT_PUBLIC_OTEL_SERVICE_NAME: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'cms-browser',
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT,
};

const envValidationResult = serverEnvSchema.safeParse(runtimeEnv);

let validatedEnv: TEnv;

if (!envValidationResult.success) {
    // During build time, just warn - env vars will be provided at runtime by PM2
    if (isBuildTime) {
        console.warn(
            "⚠️ Some environment variables are using placeholder values during build. " +
            "Runtime values will be injected by PM2 at container startup."
        );
        // Use the runtime env with placeholders during build
        validatedEnv = runtimeEnv as TEnv;
    } else {
        // At runtime, env vars must be valid
        throw new Error(
            "❌ Invalid environment variables: " +
                JSON.stringify(envValidationResult.error.format(), null, 4),
        );
    }
} else {
    // Validation passed - use the validated data
    validatedEnv = envValidationResult.data;
}

export default validatedEnv;