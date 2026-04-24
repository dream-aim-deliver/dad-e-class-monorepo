import Script from 'next/script';

/**
 * Usercentrics CMP v3 loader script.
 *
 * Mirrors the canonical Usercentrics snippet by rendering the loader directly
 * into <head> with `strategy="beforeInteractive"` so it ships with the initial
 * HTML. Injecting it server-side eliminates the hydration race that a
 * client-side `useEffect`-based injection suffers from: if hydration is
 * delayed, aborted, or skipped (bfcache restore, upstream error boundary,
 * slow/cancelled chunk), an effect-injected loader never fetches and the
 * banner never appears.
 *
 * The loader reads its tenant configuration from `data-settings-id` and the
 * banner language from `data-language`; both are set at server-render time
 * from RuntimeConfig + the routed locale.
 *
 * Renders nothing when Usercentrics is not configured for this tenant.
 */
interface TUsercentricsCMPLoaderProps {
    /** If unset, the component renders nothing. */
    settingsId: string | undefined;
    /** ISO 639-1 language code (e.g. "de", "en"). */
    language?: string;
}

const CMP_LOADER_URL = 'https://web.cmp.usercentrics.eu/ui/loader.js';

export function UsercentricsCMPLoader({
    settingsId,
    language,
}: TUsercentricsCMPLoaderProps) {
    if (!settingsId) return null;
    return (
        <Script
            id="usercentrics-cmp"
            src={CMP_LOADER_URL}
            strategy="beforeInteractive"
            data-settings-id={settingsId}
            {...(language ? { 'data-language': language } : {})}
        />
    );
}
