'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { sendGTMEvent } from '@next/third-parties/google';
import { sha256Hex } from '../../common/utils/hash-string';

/**
 * Subscribes to the next-auth session and pushes a hashed user_id into the
 * dataLayer on login, and a reset on logout.
 *
 * Hashing: SHA-256 of the raw session user.id. This guards the raw internal
 * ID from being sent to Google while preserving cross-device attribution
 * (same user → same hash).
 *
 * The `reset_identity` dataLayer event is a custom signal; GTM can optionally
 * wire it to a GA4 "user_id cleared" behavior. The accompanying `user_id: null`
 * push clears the identity on any subsequent event.
 */
export function AnalyticsIdentityBinder(): null {
    const session = useSession();

    useEffect(() => {
        if (session.status === 'loading') return;

        if (session.status === 'authenticated') {
            const rawId = session.data?.user?.id;
            if (!rawId) return;
            let cancelled = false;
            sha256Hex(rawId).then((hash) => {
                if (cancelled) return;
                sendGTMEvent({ user_id: `sha256:${hash}` });
            });
            return () => {
                cancelled = true;
            };
        }

        // unauthenticated (post-logout or never-logged-in)
        sendGTMEvent({ user_id: null });
        sendGTMEvent({ event: 'reset_identity' });
        return undefined;
    }, [session.status, session.data?.user?.id]);

    return null;
}
