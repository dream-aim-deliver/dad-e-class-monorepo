import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import env from '../../../../lib/infrastructure/server/config/env';

/**
 * Debug endpoint to verify runtime environment variables
 * This endpoint shows that:
 * 1. connection() enables dynamic rendering
 * 2. Environment variables are read at request time via env.ts, not build time
 * 3. Different containers get different values based on their env vars
 *
 * Access at: /api/debug/runtime-config
 *
 * IMPORTANT: Remove or protect this endpoint in production!
 */
export async function GET() {
    // Opt into dynamic rendering - this causes env.ts to be evaluated at request time
    await connection();

    // Read environment variables at REQUEST TIME from env.ts
    const runtimeConfig = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        runtimeValues: {
            NEXT_PUBLIC_E_CLASS_RUNTIME: env.NEXT_PUBLIC_E_CLASS_RUNTIME,
            NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
            NEXT_PUBLIC_E_CLASS_CMS_REST_URL: env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL,
        },
        proof: {
            message:
                'If you see different values when you change env vars and restart, then runtime config is working!',
            buildTime:
                'These values were NOT frozen at build time - they are read on each request from env.ts',
            source: 'Values read from env.ts (the single source of truth for environment variables)',
        },
    };

    return NextResponse.json(runtimeConfig, {
        headers: {
            'Content-Type': 'application/json',
            'X-Runtime-Config-Enabled': 'true',
            'Cache-Control': 'no-store', // Don't cache this response
        },
    });
}
