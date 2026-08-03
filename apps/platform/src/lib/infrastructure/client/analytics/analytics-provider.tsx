'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import { useRuntimeConfig } from '../context/runtime-config-context';

interface TAnalyticsProviderProps {
    children: React.ReactNode;
}

/**
 * Loads GTM when NEXT_PUBLIC_GTM_ID is set in RuntimeConfig.
 *
 * IMPORTANT — Consent Mode ownership (Compliance-Critical):
 *
 * This component deliberately writes NO Google Consent Mode signals. Both the
 * `default = denied` baseline AND every `update` are owned exclusively by the
 * Usercentrics GTM Tag Template in the tenant's GTM container (the default
 * fires on the Consent Initialization trigger; `wait_for_update: 2000`
 * recommended).
 *
 * It used to push updates too, mirroring the CMP's category state into
 * `gtag('consent', 'update', ...)`. That made two independent writers to one
 * global state, and the app's mapping was the less accurate of the two: the
 * template pushed 4 signals, the app pushed the same 4 plus
 * `personalization_storage`, derived from lossy category flags. Measured on
 * production, that duplication is what escalated a user who had accepted only
 * Google Analytics from `gcs=G101` to `gcs=G111` — the template alone got the
 * case right. See #705.
 *
 * DO NOT reintroduce a consent command here or in GtagBootstrapScript. The
 * single-writer guarantee only holds while the Usercentrics template is
 * configured in GTM; if Usercentrics/GTM is ever removed, a denied-by-default
 * baseline and its updates must be re-implemented in code, deliberately.
 *
 * Gating first-party code (bundled JS the CMP's autoblocker cannot intercept)
 * is a separate concern and stays in the app — see hasServiceConsent() and
 * OTelBrowserProvider.
 *
 * Reads the GTM ID from useRuntimeConfig() — NOT from build-time env — so the
 * 3-tenant one-build deployment model works: each tenant's Docker container
 * sets its own NEXT_PUBLIC_GTM_ID at runtime, and the server picks it up per
 * request, piping it to us through RuntimeConfigProvider.
 *
 * Must be rendered INSIDE a <RuntimeConfigProvider>.
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
