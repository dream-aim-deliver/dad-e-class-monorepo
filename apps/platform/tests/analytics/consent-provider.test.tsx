import { describe, it, expect, vi } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import {
    ConsentProvider,
    useConsent,
} from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import type { TConsentAdapter } from '../../src/lib/infrastructure/client/analytics/consent/consent-adapter';

function Probe() {
    const { consent, showBanner } = useConsent();
    return (
        <div>
            <span data-testid="analytics">{String(consent.analytics)}</span>
            <span data-testid="marketing">{String(consent.marketing)}</span>
            <span data-testid="preferences">{String(consent.preferences)}</span>
            <button onClick={showBanner}>manage</button>
        </div>
    );
}

function fakeAdapter(): TConsentAdapter & {
    emit: (s: { analytics: boolean; marketing: boolean; preferences: boolean }) => void;
} {
    let currentHandler: ((s: unknown) => void) | null = null;
    return {
        init: vi.fn(),
        onConsentChange(handler) {
            handler({ analytics: false, marketing: false, preferences: false });
            currentHandler = handler as (s: unknown) => void;
            return () => {
                currentHandler = null;
            };
        },
        showBanner: vi.fn(),
        emit(state) {
            currentHandler?.(state);
        },
    };
}

describe('ConsentProvider', () => {
    it('calls adapter.init on mount and exposes initial state via context', () => {
        const adapter = fakeAdapter();
        render(
            <ConsentProvider adapter={adapter}>
                <Probe />
            </ConsentProvider>,
        );
        expect(adapter.init).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('analytics').textContent).toBe('false');
    });

    it('re-renders children when adapter emits a new consent state', () => {
        const adapter = fakeAdapter();
        render(
            <ConsentProvider adapter={adapter}>
                <Probe />
            </ConsentProvider>,
        );

        act(() => {
            adapter.emit({ analytics: true, marketing: false, preferences: true });
        });

        expect(screen.getByTestId('analytics').textContent).toBe('true');
        expect(screen.getByTestId('preferences').textContent).toBe('true');
        expect(screen.getByTestId('marketing').textContent).toBe('false');
    });

    it('showBanner() on the context delegates to adapter.showBanner', () => {
        const adapter = fakeAdapter();
        render(
            <ConsentProvider adapter={adapter}>
                <Probe />
            </ConsentProvider>,
        );

        act(() => {
            screen.getByText('manage').click();
        });
        expect(adapter.showBanner).toHaveBeenCalledTimes(1);
    });
});
