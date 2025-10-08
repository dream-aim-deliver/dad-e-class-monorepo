'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@maany_shr/e-class-ui-kit';
import ConfirmTimeContent from '../../../common/confirm-time-content';
import { useAddAvailability } from '../hooks/use-add-availability';

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
                <Button variant="primary" text="Add Availability" />
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
                />
            </DialogContent>
        </Dialog>
    );
}
