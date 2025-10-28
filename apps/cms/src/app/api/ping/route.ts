import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Kubernetes readiness/liveness probes
 * @returns JSON response with status and timestamp
 */
export async function GET() {
    return NextResponse.json(
        {
            message: 'pong',
            status: 'healthy',
            timestamp: new Date().toISOString(),
        },
        {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        }
    );
}

/**
 * HEAD method for health checks (used by some monitoring tools)
 * @returns Empty response with 200 OK status
 */
export async function HEAD() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}
