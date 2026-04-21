'use client';

import { useMemo } from 'react';
import { createCookiebotAdapter } from './consent/cookiebot-adapter';
import { createNoopAdapter } from './consent/noop-adapter';
import { ConsentProvider } from './consent/consent-provider';
import { AnalyticsProvider } from './analytics-provider';
import { AnalyticsIdentityBinder } from './identity-binder';
import { useRuntimeConfig } from '../context/runtime-config-context';

interface TPlatformAnalyticsProps {
    children: React.ReactNode;
}

/**
 * Single wrapper component that composes the full analytics stack:
 *   <ConsentProvider>
 *     <AnalyticsProvider>
 *       <AnalyticsIdentityBinder />
 *       children
 *
 * Adapter selection is RuntimeConfig-driven: Cookiebot when
 * NEXT_PUBLIC_COOKIEBOT_CBID is present in the tenant's runtime config,
 * noop otherwise. This wrapper is mounted into both the (wired-pages)
 * layout and the auth layout so all routes get consent + tracking
 * coverage without a shared root layout.
 *
 * Must be rendered INSIDE <RuntimeConfigProvider> (and <SessionProvider>,
 * for the identity binder).
 */
export function PlatformAnalytics({ children }: TPlatformAnalyticsProps) {
    const { NEXT_PUBLIC_COOKIEBOT_CBID: cbid } = useRuntimeConfig();

    const adapter = useMemo(
        () => (cbid ? createCookiebotAdapter({ cbid }) : createNoopAdapter()),
        [cbid],
    );

    return (
        <ConsentProvider adapter={adapter}>
            <AnalyticsProvider>
                <AnalyticsIdentityBinder />
                {children}
            </AnalyticsProvider>
        </ConsentProvider>
    );
}
