'use client';

import { useEffect } from 'react';

/**
 * MOBILE-HACK: Client component that overrides the viewport meta tag at runtime.
 *
 * Used for the course page's authenticated-visitor edge case where generateViewport()
 * returned 1280 (because a session exists) but the RSC determined the user is actually
 * a visitor. This component corrects the viewport on the client.
 *
 * Remove when all mobile views are done and the viewport hack is removed.
 */
export function MobileReadyViewport() {
    useEffect(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute(
                'content',
                'width=device-width, initial-scale=1',
            );
        }
    }, []);
    return null;
}
