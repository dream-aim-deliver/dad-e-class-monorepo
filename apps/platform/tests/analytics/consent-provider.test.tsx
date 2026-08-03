import { describe, it, expect, vi } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import {
    ConsentProvider,
    useConsent,
} from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import type { TConsentAdapter } from '../../src/lib/infrastructure/client/analytics/consent/consent-adapter';
import {
    DENIED_CONSENT,
    hasServiceConsent,
    type TConsentState,
} from '../../src/lib/infrastructure/client/analytics/types';

function Probe() {
    const { consent, showBanner } = useConsent();
    return (
        <div>
            <span data-testid="ga">
                {String(hasServiceConsent(consent, 'google analytics'))}
            </span>
            <span data-testid="otel">
                {String(hasServiceConsent(consent, 'opentelemetry'))}
            </span>
            <button onClick={showBanner}>manage</button>
        </div>
    );
}

function fakeAdapter(): TConsentAdapter & {
    emit: (s: TConsentState) => void;
} {
    let currentHandler: ((s: TConsentState) => void) | null = null;
    return {
        init: vi.fn(),
        onConsentChange(handler) {
            handler({ ...DENIED_CONSENT });
            currentHandler = handler;
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
        expect(screen.getByTestId('ga').textContent).toBe('false');
        expect(screen.getByTestId('otel').textContent).toBe('false');
    });

    it('re-renders children when adapter emits a new consent state', () => {
        const adapter = fakeAdapter();
        render(
            <ConsentProvider adapter={adapter}>
                <Probe />
            </ConsentProvider>,
        );

        act(() => {
            adapter.emit({
                services: {
                    'google analytics': true,
                    'platform performance & error monitoring (opentelemetry)':
                        false,
                },
            });
        });

        expect(screen.getByTestId('ga').textContent).toBe('true');
        // Consent is per service: accepting Google Analytics must not imply
        // consent to an unrelated service.
        expect(screen.getByTestId('otel').textContent).toBe('false');
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
