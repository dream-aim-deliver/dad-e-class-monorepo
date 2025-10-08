import * as React from 'react';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface DeleteConfirmationModalProps extends isLocalAware {
    onClose: () => void;
    onDelete: () => void;
    title: string;
    message?: string;
}

/**
 * DeleteConfirmationModal component for confirming deletion actions.
 * Uses type-safe props for modal control and localization.
 *
 * @param onClose - Callback to close the modal
 * @param onDelete - Callback to confirm deletion
 * @param locale - The locale for translation and localization purposes
 * @param title - Title for the modal
 * @param message - Optional custom message
 *
 * @example
 * <DeleteConfirmationModal
 *   locale="en"
 *   title="Delete Topic?"
 *   onClose={() => setIsOpen(false)}
 *   onDelete={() => handleDelete(itemId)}
 * />
 */

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    onClose,
    onDelete,
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
                        text={dictionary.components.deleteConfirmationModal.noText}
                        onClick={onClose}
                    />
                    <Button
                        className="w-full"
                        variant="primary"
                        size="medium"
                        text={dictionary.components.deleteConfirmationModal.yesDeleteText}
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    );
};
