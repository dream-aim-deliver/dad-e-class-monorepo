import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { checkoutIntentManager } from '../utils/checkout-intent';
import { useCaseModels } from '@maany_shr/e-class-models';

interface UseCheckoutIntentProps {
    /**
     * Callback to execute when resuming a checkout after login
     */
    onResumeCheckout: (
        request: useCaseModels.TPrepareCheckoutRequest,
    ) => void | Promise<void>;
}

/**
 * Hook to manage checkout intent preservation across login/signup flows
 *
 * This hook:
 * 1. Provides a way to save checkout intent before redirecting to login
 * 2. Automatically resumes checkout after successful login
 * 3. Handles cleanup and expiry of stale intents
 */
export function useCheckoutIntent({
    onResumeCheckout,
}: UseCheckoutIntentProps) {
    const session = useSession();
    const isLoggedIn = !!session.data;

    // Check for pending checkout intent after login
    useEffect(() => {
        // Only check for pending intent if user is logged in
        if (!isLoggedIn) return;

        const intent = checkoutIntentManager.get();
        if (!intent) return;

        // User is now logged in and we have a pending checkout
        console.log('Resuming checkout intent:', intent);

        // Clear the intent first to prevent loops
        checkoutIntentManager.clear();

        // Resume the checkout
        onResumeCheckout(intent.request);
    }, [isLoggedIn, onResumeCheckout]);

    /**
     * Save a checkout intent before redirecting to login
     */
    const saveIntent = useCallback(
        (
            request: useCaseModels.TPrepareCheckoutRequest,
            returnPath: string,
        ) => {
            checkoutIntentManager.save(request, returnPath);
        },
        [],
    );

    return {
        /**
         * Save a checkout intent to localStorage
         */
        saveIntent,

        /**
         * Check if there's a pending checkout intent
         */
        hasIntent: checkoutIntentManager.has(),

        /**
         * Clear the current checkout intent
         */
        clearIntent: checkoutIntentManager.clear,
    };
}
