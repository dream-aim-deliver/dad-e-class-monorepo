'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogBody } from './dialog';
import { InputField } from './input-field';
import { Button } from './button';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

export interface ArchivePackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    locale: TLocale;
}

export interface ArchiveSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale: TLocale;
}

/**
 * ArchivePackageModal component for confirming package archiving with text input validation.
 * Requires user to type "ARCHIVE" to enable the confirmation button.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param onConfirm - Callback to confirm archiving
 * @param isLoading - Loading state for the confirmation action
 * @param locale - Locale for localization
 */
export const ArchivePackageModal: React.FC<ArchivePackageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText === 'ARCHIVE';

    // Reset input when modal opens
    useEffect(() => {
        if (isOpen) {
            setConfirmText('');
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
            <DialogContent
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
                className="max-w-md"
            >
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <h5>
                            {dictionary.components.archivePackageModal.confirmationTitle}
                        </h5>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-text-secondary text-sm">
                                {dictionary.components.archivePackageModal.inputLabel}
                            </label>
                            <InputField
                                inputText={dictionary.components.archivePackageModal.inputPlaceholder}
                                value={confirmText}
                                setValue={setConfirmText}
                                state={confirmText ? 'filling' : 'placeholder'}
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <Button
                                variant="primary"
                                size="medium"
                                text={dictionary.components.archivePackageModal.archiveButton}
                                onClick={onConfirm}
                                disabled={!isValid || isLoading}
                                className="w-full"
                            />
                            
                            <Button
                                variant="text"
                                size="medium"
                                text={dictionary.components.archivePackageModal.backButton}
                                onClick={onClose}
                                className="w-full"                           
                                
                            />
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

/**
 * ArchiveSuccessModal component for showing successful package archiving.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param locale - Locale for localization
 */
export const ArchiveSuccessModal: React.FC<ArchiveSuccessModalProps> = ({
    isOpen,
    onClose,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
            <DialogContent
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
                className="max-w-md"
            >
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-center">
                            {dictionary.components.archiveSuccessModal.successTitle}
                        </h3>
                        
                        <div className="flex justify-center mt-6">
                            <Button
                                variant="primary"
                                size="medium"
                                text={dictionary.components.archiveSuccessModal.closeButton}
                                onClick={onClose}
                                className="w-full"
                            />
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
