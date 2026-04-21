'use client';

import Script from 'next/script';
import { useRuntimeConfig } from '../context/runtime-config-context';

/**
 * Renders Cookiebot's Cookie Declaration table at the position where this
 * component is mounted. The table is auto-generated from Cookiebot's weekly
 * scan of the site — it lists every cookie by name, category, expiry, and
 * purpose. Required for GDPR Art. 13 and Swiss FMG Art. 45c disclosure.
 *
 * Reads the CBID from useRuntimeConfig() so it picks up the correct tenant
 * in the 3-tenant deployment model. Returns null when the CBID is unset
 * (consistent with noop behavior across the rest of the analytics module).
 *
 * Mount inside the privacy policy page (or a dedicated /cookie-policy page).
 * Do NOT mount in a layout — it would render on every page.
 */
export function CookieDeclaration(): React.ReactElement | null {
    const { NEXT_PUBLIC_COOKIEBOT_CBID: cbid } = useRuntimeConfig();
    if (!cbid) return null;
    return (
        <Script
            id="CookieDeclaration"
            src={`https://consent.cookiebot.com/${cbid}/cd.js`}
            strategy="afterInteractive"
            async
        />
    );
}
