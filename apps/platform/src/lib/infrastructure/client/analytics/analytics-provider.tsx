'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import { useRuntimeConfig } from '../context/runtime-config-context';

interface TAnalyticsProviderProps {
    children: React.ReactNode;
}

/**
 * Loads GTM when NEXT_PUBLIC_GTM_ID is set in RuntimeConfig.
 *
 * Consent Mode ownership (Compliance-Critical):
 * This component does NOT call gtag('consent', …). Both the default-denied
 * baseline and all consent updates are owned exclusively by the Usercentrics
 * GTM Tag Template in the tenant's GTM container. See
 * `docs/consent-mode-ownership.md` for the full ownership model and manual
 * verification steps.
 *
 * In-app consent state (ConsentProvider / usercentrics-adapter) gates only
 * first-party behaviour — OpenTelemetry, track.* — not Google Consent Mode.
 *
 * Reads the GTM ID from useRuntimeConfig() — NOT from build-time env — so the
 * 3-tenant one-build deployment model works: each tenant's Docker container
 * sets its own NEXT_PUBLIC_GTM_ID at runtime, and the server picks it up per
 * request, piping it to us through RuntimeConfigProvider.
 *
 * Must be rendered INSIDE <RuntimeConfigProvider>. ConsentProvider is a
 * sibling/wrapper concern (see PlatformAnalytics); this file intentionally
 * does not subscribe to consent state.
 */
export function AnalyticsProvider({ children }: TAnalyticsProviderProps) {
    const { NEXT_PUBLIC_GTM_ID: gtmId } = useRuntimeConfig();

    return (
        <>
            {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
            {children}
        </>
    );
}
