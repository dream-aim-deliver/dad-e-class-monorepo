import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

const mockUseSession = vi.fn();
vi.mock('next-auth/react', () => ({
    useSession: () => mockUseSession(),
}));

import { AnalyticsIdentityBinder } from '../../src/lib/infrastructure/client/analytics/identity-binder';

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

function readDataLayer(): unknown[] {
    return ((window as Window).dataLayer ?? []).slice();
}

describe('AnalyticsIdentityBinder', () => {
    beforeEach(() => {
        (window as Window).dataLayer = [];
        mockUseSession.mockReset();
    });

    afterEach(() => {
        delete (window as Window).dataLayer;
    });

    it('pushes nothing when session is loading', () => {
        mockUseSession.mockReturnValue({ status: 'loading', data: null });
        render(<AnalyticsIdentityBinder />);
        expect(readDataLayer()).toEqual([]);
    });

    it('pushes hashed user_id when user is authenticated', async () => {
        mockUseSession.mockReturnValue({
            status: 'authenticated',
            data: { user: { id: 'user-42' } },
        });
        render(<AnalyticsIdentityBinder />);

        // Wait for the async hash computation.
        await waitFor(() => {
            const layer = readDataLayer();
            expect(layer.length).toBeGreaterThan(0);
        });

        const layer = readDataLayer();
        const idPush = layer.find(
            (entry): entry is { user_id: string } =>
                typeof entry === 'object' && entry !== null && 'user_id' in entry,
        );
        expect(idPush).toBeDefined();
        expect(idPush!.user_id).toMatch(/^sha256:[0-9a-f]{64}$/);
    });

    it('pushes user_id: null and reset_identity on logout transition', async () => {
        // Start authenticated.
        mockUseSession.mockReturnValue({
            status: 'authenticated',
            data: { user: { id: 'user-42' } },
        });
        const { rerender } = render(<AnalyticsIdentityBinder />);
        await waitFor(() => expect(readDataLayer().length).toBeGreaterThan(0));
        (window as Window).dataLayer = [];

        // Transition to unauthenticated.
        mockUseSession.mockReturnValue({ status: 'unauthenticated', data: null });
        rerender(<AnalyticsIdentityBinder />);

        await waitFor(() => {
            const layer = readDataLayer();
            expect(layer).toContainEqual({ user_id: null });
            expect(layer).toContainEqual({ event: 'reset_identity' });
        });
    });
});
