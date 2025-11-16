/**
 * localStorage utility for checkout session persistence
 * Enables recovery after window close/reload
 */

const STORAGE_KEY = 'checkout_sessions';
const MAX_ENTRIES = 10;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface StoredSession {
    sessionId: string;
    timestamp: number;
    completed: boolean;
}

export const checkoutSessionStorage = {
    /**
     * Save a completed session to localStorage
     */
    saveCompletedSession(sessionId: string): void {
        if (typeof window === 'undefined') return;

        try {
            const stored = this.getAll();
            stored.push({
                sessionId,
                timestamp: Date.now(),
                completed: true,
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            this.cleanup();
        } catch (e) {
            console.error('[checkoutSessionStorage] Failed to save session:', e);
        }
    },

    /**
     * Check if a session has already been completed
     */
    isSessionCompleted(sessionId: string): boolean {
        if (typeof window === 'undefined') return false;

        const stored = this.getAll();
        return stored.some((s) => s.sessionId === sessionId && s.completed);
    },

    /**
     * Get all stored sessions
     */
    getAll(): StoredSession[] {
        if (typeof window === 'undefined') return [];

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('[checkoutSessionStorage] Failed to read sessions:', e);
            return [];
        }
    },

    /**
     * Clean up old entries (auto-called after save)
     * Removes entries older than MAX_AGE_MS and keeps only MAX_ENTRIES most recent
     */
    cleanup(): void {
        if (typeof window === 'undefined') return;

        try {
            let stored = this.getAll();
            const now = Date.now();

            // Remove old entries
            stored = stored.filter((s) => now - s.timestamp < MAX_AGE_MS);

            // Keep only latest MAX_ENTRIES
            stored = stored.slice(-MAX_ENTRIES);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        } catch (e) {
            console.error('[checkoutSessionStorage] Failed to cleanup sessions:', e);
        }
    },

    /**
     * Clear all stored sessions
     */
    clear(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('[checkoutSessionStorage] Failed to clear sessions:', e);
        }
    },
};
