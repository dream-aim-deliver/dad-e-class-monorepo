'use client';

import { PlatformProvider } from './platform-context';
import type { TGetPlatformSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';

interface PlatformProviderWithSuspenseProps {
    children: React.ReactNode;
    platform: TGetPlatformSuccessResponse['data'];
}

/**
 * Client component that provides platform data to the application.
 *
 * Platform data is now fetched server-side with 15-minute caching,
 * eliminating the need for client-side queries and improving performance.
 *
 * This component should be wrapped in a Suspense boundary in the layout.
 * The server should fetch the data using:
 * ```tsx
 * const platformData = await getPlatformCached();
 * ```
 */
export function PlatformProviderWithSuspense({ children, platform }: PlatformProviderWithSuspenseProps) {
    return (
        <PlatformProvider platform={platform}>
            {children}
        </PlatformProvider>
    );
}
