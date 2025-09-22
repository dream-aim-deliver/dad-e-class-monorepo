import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Dialog, DialogContent, DialogBody } from './dialog';
import { TextAreaInput } from './text-areaInput';
import { IconLoaderSpinner } from './icons/icon-loader-spinner';
import { viewModels } from '@maany_shr/e-class-models';
import DefaultError from './default-error';
import { TLocale } from '@maany_shr/e-class-translations';
import Banner from './banner';
interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    viewModel?: viewModels.TScheduleCoachingSessionViewModel | viewModels.TUnscheduleCoachingSessionViewModel;
    title: string;
    message: string;
    locale: TLocale;
    declineReasonPlaceholder?: string;
}
interface AcceptanceModalProps extends BaseModalProps {
    onConfirm: () => void;
    confirmText: string;
    type: 'accept';
}

interface DeclineModalProps extends BaseModalProps {
    onConfirm: (reason: string) => void;
    confirmText: string;
    type: 'decline';
    declineReasonPlaceholder?: string;
}

type ModalProps = AcceptanceModalProps | DeclineModalProps;


export const ConfirmationModal: React.FC<ModalProps> = ({
    type,
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    isLoading = false,
    viewModel,
    locale,
    declineReasonPlaceholder="placeholder..."
}) => {
    const [declineReason, setDeclineReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDeclineReason('');
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
                        <h2 className="text-xl font-semibold text-text-primary">
                            {title}
                        </h2>
                        <p className="text-text-secondary">
                            {message}
                        </p>
                        {type === 'decline' && setDeclineReason && (
                            <TextAreaInput
                                label="Reason for declining"
                                value={declineReason}
                                setValue={setDeclineReason}
                                placeholder={declineReasonPlaceholder}
                                className="mt-2"
                            />
                        )}
                        <div className="flex gap-3 justify-end mt-6">
                            {isLoading ? (
                                <IconButton
                                    size="medium"
                                    styles="primary"
                                    icon={<IconLoaderSpinner classNames='animate-spin' />}
                                    disabled={true}
                                />
                            ) : (
                                <Button
                                    variant="primary"
                                    text={confirmText}
                                    onClick={() => {
                                        if (type === 'decline') {
                                            (onConfirm as (reason: string) => void)?.(declineReason);
                                        } else {
                                            (onConfirm as () => void)?.();
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                            )}

                        </div>
                        <div>
                            {viewModel?.mode === 'kaboom' && <DefaultError locale={locale} />}
                            {viewModel?.mode === 'default' && <Banner style="success" description="Operation completed successfully!" />}
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};
