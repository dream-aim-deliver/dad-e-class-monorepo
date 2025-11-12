import * as React from 'react';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface AssessmentSubmissionConfirmationModalProps extends isLocalAware {
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    message?: string;
}

/**
 * AssessmentSubmissionConfirmationModal component for confirming assessment submission.
 * Used to warn users that they cannot change their answers after submission.
 *
 * @param onClose - Callback to close the modal and go back
 * @param onSubmit - Callback to confirm submission
 * @param locale - The locale for translation and localization purposes
 * @param title - Title for the modal
 * @param message - Optional custom message
 *
 * @example
 * <AssessmentSubmissionConfirmationModal
 *   locale="en"
 *   title="Submit Assessment?"
 *   message="You cannot change your answers after submission."
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={() => handleSubmit()}
 * />
 */
export const AssessmentSubmissionConfirmationModal: React.FC<AssessmentSubmissionConfirmationModalProps> = ({
    onClose,
    onSubmit,
    locale,
    title,
    message,
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill max-w-[340px] shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
            <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text p-1"
                />
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <p className='text-xl text-text-primary'>
                    {title}
                </p>
                {message && (
                    <p className='text-sm text-text-secondary'>
                        {message}
                    </p>
                )}
                <div className='flex justify-between items-center w-full gap-2'>
                    <Button
                        className='w-full'
                        variant="secondary"
                        size="medium"
                        text={dictionary.components.assessmentSubmissionConfirmationModal.goBackText}
                        onClick={onClose}
                    />
                    <Button
                        className="w-full"
                        variant="primary"
                        size="medium"
                        text={dictionary.components.assessmentSubmissionConfirmationModal.submitText}
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

