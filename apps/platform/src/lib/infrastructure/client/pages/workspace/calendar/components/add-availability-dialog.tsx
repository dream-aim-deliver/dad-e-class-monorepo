'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@maany_shr/e-class-ui-kit';
import ConfirmTimeContent from '../../../common/confirm-time-content';
import { useAddAvailability } from '../hooks/use-add-availability';
import { useTranslations } from 'next-intl';

interface AddAvailabilityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddAvailabilityDialog({
    isOpen,
    onOpenChange,
    onSuccess,
}: AddAvailabilityDialogProps) {
    const t = useTranslations('pages.calendarPage');
    const {
        startTime,
        endTime,
        setStartTime,
        setEndTime,
        error,
        isSubmitting,
        validateAndSubmit,
        reset,
    } = useAddAvailability({ onSuccess });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="primary" text={t('addAvailabilityButton')} />
            </DialogTrigger>
            <DialogContent
                showCloseButton
                closeOnOverlayClick
                closeOnEscape
            >
                <ConfirmTimeContent
                    startTime={startTime}
                    endTime={endTime}
                    setStartTime={setStartTime}
                    setEndTime={setEndTime}
                    isSubmitting={isSubmitting}
                    onSubmit={validateAndSubmit}
                    submitError={error}
                    buttonText={isSubmitting ? t('addingAvailability') : t('addAvailabilityButton')}
                />
            </DialogContent>
        </Dialog>
    );
}
