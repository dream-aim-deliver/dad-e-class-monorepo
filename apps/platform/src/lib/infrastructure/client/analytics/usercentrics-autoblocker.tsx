import Script from 'next/script';

/**
 * Usercentrics autoblocker script.
 *
 * Must run before any other tracker script on the page so Usercentrics can
 * block third-party tags (GA, Meta Pixel, etc.) until the user consents.
 * Placed in <head> with `strategy="beforeInteractive"` so Next.js inlines it
 * into the initial HTML.
 *
 * Renders nothing when Usercentrics is not configured for this tenant (no
 * settings ID in RuntimeConfig). Because this runs in `<head>` before the
 * React tree mounts, it reads its settings ID from a prop passed by the
 * server-rendered layout rather than from `useRuntimeConfig()`.
 */
interface TUsercentricsAutoblockerProps {
    /** If unset, the component renders nothing. */
    settingsId: string | undefined;
}

const AUTOBLOCKER_URL = 'https://web.cmp.usercentrics.eu/modules/autoblocker.js';

export function UsercentricsAutoblocker({
    settingsId,
}: TUsercentricsAutoblockerProps) {
    if (!settingsId) return null;
    return (
        <Script
            id="usercentrics-autoblocker"
            src={AUTOBLOCKER_URL}
            strategy="beforeInteractive"
        />
    );
}
