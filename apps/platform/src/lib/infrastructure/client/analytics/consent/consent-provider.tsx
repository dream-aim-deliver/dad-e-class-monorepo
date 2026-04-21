'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DENIED_CONSENT, type TConsentState } from '../types';
import type { TConsentAdapter } from './consent-adapter';

interface TConsentContext {
    consent: TConsentState;
    showBanner: () => void;
}

const ConsentContext = createContext<TConsentContext>({
    consent: DENIED_CONSENT,
    showBanner: () => {
        /* no-op until a provider is mounted */
    },
});

interface TConsentProviderProps {
    /** Injected adapter — production = usercentrics or noop; tests = fake. */
    adapter: TConsentAdapter;
    children: React.ReactNode;
}

export function ConsentProvider({ adapter, children }: TConsentProviderProps) {
    const [consent, setConsent] = useState<TConsentState>(DENIED_CONSENT);
    const adapterRef = useRef(adapter);
    adapterRef.current = adapter;

    useEffect(() => {
        adapter.init();
        const unsubscribe = adapter.onConsentChange((state) => {
            setConsent(state);
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value: TConsentContext = {
        consent,
        showBanner: () => adapterRef.current.showBanner(),
    };

    return (
        <ConsentContext.Provider value={value}>
            {children}
        </ConsentContext.Provider>
    );
}

/**
 * Access the current consent state + showBanner().
 *
 * Safe to call outside a provider — returns the default all-denied state.
 * That way, a "Manage cookies" footer link won't crash when analytics is
 * dark (env vars unset).
 */
export function useConsent(): TConsentContext {
    return useContext(ConsentContext);
}
