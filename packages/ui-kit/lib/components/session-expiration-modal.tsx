'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface SessionExpirationModalProps extends isLocalAware {
    isOpen: boolean;
    hasUnsavedChanges: boolean;
    onConfirm: () => void;
    /** Whether the user can dismiss the modal and continue browsing (for mixed routes) */
    allowDismiss?: boolean;
    /** Callback when user dismisses the modal to continue as visitor */
    onDismiss?: () => void;
}

/**
 * SessionExpirationModal component for notifying users when their session has expired.
 * Shows different messaging based on whether the user has unsaved changes.
 * Renders within the theme context (not as a portal) to maintain theme styles.
 *
 * @param isOpen - Whether the modal is visible
 * @param hasUnsavedChanges - Whether there are unsaved changes that will be lost
 * @param onConfirm - Callback to handle redirect to login
 * @param allowDismiss - Whether the user can dismiss and continue browsing (for mixed routes)
 * @param onDismiss - Callback when user dismisses the modal
 * @param locale - The locale for translation and localization purposes
 *
 * @example
 * <SessionExpirationModal
 *   locale="en"
 *   isOpen={sessionExpired}
 *   hasUnsavedChanges={hasUnsaved}
 *   onConfirm={() => router.push('/auth/login')}
 *   allowDismiss={isMixedRoute}
 *   onDismiss={() => signOut({ redirect: false })}
 * />
 */
export const SessionExpirationModal: React.FC<SessionExpirationModalProps> = ({
    isOpen,
    hasUnsavedChanges,
    onConfirm,
    allowDismiss = false,
    onDismiss,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />

            {/* Modal card */}
            <div className="relative flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] max-w-[400px] w-full">
                <div className="flex flex-col gap-4 w-full">
                    <p className="text-xl font-semibold text-text-primary">
                        {dictionary.components.sessionExpirationModal.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                        {dictionary.components.sessionExpirationModal.message}
                    </p>
                    {hasUnsavedChanges && (
                        <div className="p-3 rounded-md bg-yellow-900/30 border border-yellow-600/50">
                            <p className="text-sm text-yellow-100 font-medium">
                                {dictionary.components.sessionExpirationModal.unsavedChangesWarning}
                            </p>
                        </div>
                    )}
                    <div className="flex items-center w-full pt-2 flex-col gap-2">
                        <Button
                            className="w-full"
                            variant="primary"
                            size="medium"
                            text={dictionary.components.sessionExpirationModal.stayLoggedInText}
                            onClick={onConfirm}
                        />
                        {allowDismiss ? (
                            // Mixed route: Continue as visitor (stays on page)
                            <Button
                                className="w-full"
                                variant="secondary"
                                size="medium"
                                text={dictionary.components.sessionExpirationModal.continueAsVisitorText}
                                onClick={onDismiss}
                            />
                        ) : (
                            // Protected route: Logout button (goes to home)
                            <Button
                                className="w-full"
                                variant="secondary"
                                size="medium"
                                text={dictionary.components.sessionExpirationModal.logoutText}
                                onClick={onDismiss}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
