import { useCaseModels } from '@maany_shr/e-class-models';

const CHECKOUT_INTENT_KEY = 'pendingCheckoutIntent';
const INTENT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export interface CheckoutIntent {
    request: useCaseModels.TPrepareCheckoutRequest;
    timestamp: number;
    returnPath: string;
}

export const checkoutIntentManager = {
    /**
     * Save a checkout intent to localStorage
     */
    save(
        request: useCaseModels.TPrepareCheckoutRequest,
        returnPath: string,
    ): void {
        if (typeof window === 'undefined') return;

        const intent: CheckoutIntent = {
            request,
            timestamp: Date.now(),
            returnPath,
        };

        try {
            localStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(intent));
        } catch (e) {
            console.error('Failed to save checkout intent:', e);
        }
    },

    /**
     * Get the current checkout intent if it exists and hasn't expired
     */
    get(): CheckoutIntent | null {
        if (typeof window === 'undefined') return null;

        try {
            const stored = localStorage.getItem(CHECKOUT_INTENT_KEY);
            if (!stored) return null;

            const intent: CheckoutIntent = JSON.parse(stored);

            // Check if expired
            if (Date.now() - intent.timestamp > INTENT_EXPIRY_MS) {
                this.clear();
                return null;
            }

            return intent;
        } catch (e) {
            console.error('Failed to get checkout intent:', e);
            this.clear();
            return null;
        }
    },

    /**
     * Clear the current checkout intent
     */
    clear(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(CHECKOUT_INTENT_KEY);
        } catch (e) {
            console.error('Failed to clear checkout intent:', e);
        }
    },

    /**
     * Check if there's a pending checkout intent
     */
    has(): boolean {
        return this.get() !== null;
    },
};
