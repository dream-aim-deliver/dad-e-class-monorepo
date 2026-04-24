'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { createUsercentricsAdapter } from './consent/usercentrics-adapter';
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
 * Adapter selection is RuntimeConfig-driven: Usercentrics when
 * NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID is present in the tenant's runtime
 * config, noop otherwise. This wrapper is mounted into both the
 * (wired-pages) layout and the auth layout so all routes get consent +
 * tracking coverage without a shared root layout.
 *
 * The Usercentrics autoblocker script is NOT injected here — it must run
 * with `beforeInteractive` priority in <head>, so it's rendered directly
 * by each layout via <UsercentricsAutoblocker settingsId={...} />.
 *
 * Must be rendered INSIDE <RuntimeConfigProvider> (and <SessionProvider>,
 * for the identity binder).
 */
export function PlatformAnalytics({ children }: TPlatformAnalyticsProps) {
    const { NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: settingsId } =
        useRuntimeConfig();
    // Mirror next-intl's routed locale into the Usercentrics banner so the
    // CMP language matches the page language. Our language switcher does a
    // full page navigation (footer.tsx → `window.location.href = newUrl`),
    // so the adapter is re-created with the fresh locale on every switch —
    // no runtime UC_UI.changeLanguage() plumbing needed.
    const locale = useLocale();

    const adapter = useMemo(
        () =>
            settingsId
                ? createUsercentricsAdapter({ settingsId, language: locale })
                : createNoopAdapter(),
        [settingsId, locale],
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
