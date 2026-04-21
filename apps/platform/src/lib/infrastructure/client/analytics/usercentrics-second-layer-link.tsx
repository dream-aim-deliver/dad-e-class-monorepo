'use client';

import { useRuntimeConfig } from '../context/runtime-config-context';

/**
 * Opens the Usercentrics "second layer" (detailed settings + cookie
 * declaration) when clicked. Mount this on the privacy policy page (or a
 * dedicated cookie policy page) — required for GDPR Art. 13 / Swiss FMG
 * Art. 45c disclosure.
 *
 * Renders nothing when Usercentrics is not configured for the tenant. No
 * direct equivalent to Cookiebot's `cd.js` auto-rendered table exists in
 * Usercentrics v3; the second layer is the canonical way to show the full
 * cookie list.
 */
export function UsercentricsSecondLayerLink({
    children = 'Open cookie settings',
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}): React.ReactElement | null {
    const { NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: settingsId } =
        useRuntimeConfig();
    if (!settingsId) return null;

    return (
        <button
            type="button"
            className={className}
            onClick={() => {
                if (typeof window === 'undefined') return;
                window.UC_UI?.showSecondLayer?.();
            }}
        >
            {children}
        </button>
    );
}
