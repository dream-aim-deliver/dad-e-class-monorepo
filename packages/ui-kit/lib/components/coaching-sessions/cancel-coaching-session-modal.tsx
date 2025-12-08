'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconClose } from '../icons/icon-close';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { TextAreaInput } from '../text-areaInput';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import Banner from '../banner';

export interface CancelCoachingSessionModalProps extends isLocalAware {
    onClose: () => void;
    onCancel: (reason: string) => void;
    isLoading?: boolean;
    isError?: boolean;
    /** Custom modal title/text. If not provided, uses default cancel text from dictionary */
    customModalText?: string;
    /** Custom placeholder for reason input. If not provided, uses default from dictionary */
    customPlaceholder?: string;
    /** Custom confirm button text. If not provided, uses default from dictionary */
    customConfirmText?: string;
}

/**
 * CancelCoachingSessionModal component for confirming session cancellation.
 * Uses type-safe props for modal control and localization.
 *
 * @param onClose - Callback to close the modal
 * @param onCancel - Callback to confirm cancellation
 * @param locale - The locale for translation and localization purposes
 *
 * @example
 * <CancelCoachingSessionModal
 *   locale="en"
 *   onClose={() => setIsOpen(false)}
 *   onCancel={() => handleCancel(sessionId)}
 * />
 */

export const CancelCoachingSessionModal: React.FC<CancelCoachingSessionModalProps> = ({
    onClose,
    onCancel,
    locale,
    isLoading = false,
    isError = false,
    customModalText,
    customPlaceholder,
    customConfirmText,
}) => {
    const dictionary = getDictionary(locale);
    const [cancelReason, setCancelReason] = useState('');

    return (
        <div className="flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill max-w-[400px] shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
            <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text p-1"
                    disabled={isLoading}
                />
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <p className='text-xl text-text-primary'>
                    {customModalText ?? dictionary.components.coachingSessionCancelModal.modalText}
                </p>
                <TextAreaInput
                    className="min-h-[80px]"
                    placeholder={customPlaceholder ?? dictionary.components.coachingSessionCancelModal.cancelReasonPlaceholder}
                    value={cancelReason}
                    setValue={setCancelReason}
                />
                <div className='flex justify-between items-center w-full gap-2'>
                    <Button
                        className='w-full'
                        variant="secondary"
                        size="medium"
                        text={dictionary.components.coachingSessionCancelModal.noText}
                        onClick={onClose}
                        disabled={isLoading}
                    />
                    <Button
                        className="w-full"
                        variant="primary"
                        size="medium"
                        text={isLoading ? '' : (customConfirmText ?? dictionary.components.coachingSessionCancelModal.yesCancelText)}
                        onClick={() => onCancel(cancelReason)}
                        disabled={isLoading}
                        hasIconLeft={isLoading}
                        iconLeft={isLoading ? <IconLoaderSpinner classNames="animate-spin" /> : undefined}
                    />
                </div>
                {isError && (
                    <Banner
                        style="error"
                        description={dictionary.components.coachingSessionCancelModal.errorMessage || 'An error occurred. Please try again.'}
                    />
                )}
            </div>
        </div>
    );
};