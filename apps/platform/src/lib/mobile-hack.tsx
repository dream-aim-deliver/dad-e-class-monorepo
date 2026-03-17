/**
 * MOBILE-HACK: Utilities for enabling responsive mobile views on specific pages.
 *
 * These are temporary overrides while we migrate pages from the forced 1280px
 * desktop viewport to proper responsive mobile layouts.
 *
 * When all pages have proper mobile views, remove this file and the 1280px
 * viewport hack from (wired-pages)/layout.tsx and global.css.
 *
 * Search for "MOBILE-HACK" across the codebase to find all related code.
 */

/**
 * MOBILE-HACK: Server component that overrides the global `html { min-width: 1280px }`
 * CSS rule. Include this in mobile-ready pages alongside the viewport export.
 * Remove when all mobile views are done and the global min-width is removed.
 */
export function MobileReadyStyle() {
    return (
        <style
            dangerouslySetInnerHTML={{
                __html: '/* MOBILE-HACK */html{min-width:unset!important}',
            }}
        />
    );
}
