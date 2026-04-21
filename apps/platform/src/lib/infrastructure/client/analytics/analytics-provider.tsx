'use client';

import { useEffect } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import { updateConsent } from './consent-mode';
import { useConsent } from './consent/consent-provider';
import { useRuntimeConfig } from '../context/runtime-config-context';

interface TAnalyticsProviderProps {
    children: React.ReactNode;
}

/**
 * Loads GTM (when NEXT_PUBLIC_GTM_ID is set in RuntimeConfig) and bridges our
 * ConsentProvider state into Google Consent Mode v2 `gtag('consent', 'update', ...)`
 * signals.
 *
 * Reads the GTM ID from useRuntimeConfig() — NOT from build-time env — so the
 * 3-tenant one-build deployment model works: each tenant's Docker container
 * sets its own NEXT_PUBLIC_GTM_ID at runtime, and the server picks it up per
 * request, piping it to us through RuntimeConfigProvider.
 *
 * Must be rendered INSIDE both a <RuntimeConfigProvider> and <ConsentProvider>.
 */
export function AnalyticsProvider({ children }: TAnalyticsProviderProps) {
    const { consent } = useConsent();
    const { NEXT_PUBLIC_GTM_ID: gtmId } = useRuntimeConfig();

    useEffect(() => {
        updateConsent(consent);
    }, [consent]);

    return (
        <>
            {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
            {children}
        </>
    );
}
