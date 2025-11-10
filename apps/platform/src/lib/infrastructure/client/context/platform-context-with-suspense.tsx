'use client';

import { PlatformProvider } from './platform-context';
import { trpc } from '../trpc/cms-client';

interface PlatformProviderWithSuspenseProps {
    children: React.ReactNode;
}

/**
 * Client component that fetches platform data using useSuspenseQuery.
 * Works with server-side prefetching for optimal performance.
 *
 * This component should be wrapped in a Suspense boundary in the layout.
 * The server should prefetch the data using:
 * ```tsx
 * prefetch(trpc.getPlatform.queryOptions({}));
 * ```
 */
export function PlatformProviderWithSuspense({ children }: PlatformProviderWithSuspenseProps) {
    // Uses prefetched data from server (streaming pattern)
    // If data is not ready, Suspense boundary will show fallback
    const [platformResult] = trpc.getPlatform.useSuspenseQuery({});

    // @ts-ignore - Type mismatch between TRPC response and platform context
    if (!platformResult.success) {
        throw new Error('Failed to load platform data');
    }

    return (
        // @ts-ignore - Type mismatch between TRPC response data and PlatformProvider prop
        <PlatformProvider platform={platformResult.data}>
            {children}
        </PlatformProvider>
    );
}
