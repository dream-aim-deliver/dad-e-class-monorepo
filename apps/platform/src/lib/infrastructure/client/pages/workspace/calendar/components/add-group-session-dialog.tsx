'use client';

import {
    Dialog,
    DialogContent,
} from '@maany_shr/e-class-ui-kit';
import GroupSessionTimeContent from '../../../common/group-session-time-content';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import React from 'react';
import { trpc } from '../../../../trpc/client';

interface CoachingOffering {
    id: number;
    name: string;
    duration: number;
}

interface AddGroupSessionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    initialStartTime?: Date;
}

export function AddGroupSessionDialog({
    isOpen,
    onOpenChange,
    onSuccess,
    initialStartTime,
}: AddGroupSessionDialogProps) {
    const t = useTranslations('pages.calendarPage');
    const [startTime, setStartTime] = useState<Date>(initialStartTime || new Date());
    const [selectedOffering, setSelectedOffering] = useState<CoachingOffering | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const createGroupCoachingSessionMutation = trpc.createGroupCoachingSession.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reset = () => {
        setStartTime(new Date());
        setSelectedOffering(undefined);
        setError(undefined);
        setIsSubmitting(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    const validateAndSubmit = async () => {
        setError(undefined);
        
        if (!startTime) {
            setError('Start time is required');
            return;
        }

        if (!selectedOffering) {
            setError('Please select a coaching offering');
            return;
        }

        // Check if session is scheduled for the past
        if (startTime < new Date()) {
            setError('Cannot schedule sessions in the past');
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Wire up createGroupCoachingSession usecase - currently using mock implementation
            const sessionData = {
                startTime: startTime.toISOString(),
                coachingOfferingId: selectedOffering.id,
                coachingOfferingName: selectedOffering.name,
                coachingOfferingDuration: selectedOffering.duration,
                endTime: new Date(startTime.getTime() + selectedOffering.duration * 60 * 1000).toISOString(),
            };

            await createGroupCoachingSessionMutation.mutateAsync(sessionData);
            
            onSuccess();
        } catch (err) {
            setError('Failed to create group coaching session');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update start time when initialStartTime changes
    React.useEffect(() => {
        if (initialStartTime) {
            setStartTime(initialStartTime);
        }
    }, [initialStartTime]);

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton
                closeOnOverlayClick
                closeOnEscape
            >
                <GroupSessionTimeContent
                    startTime={startTime}
                    setStartTime={setStartTime}
                    selectedOffering={selectedOffering}
                    setSelectedOffering={setSelectedOffering}
                    isSubmitting={isSubmitting}
                    onSubmit={validateAndSubmit}
                    submitError={error}
                    buttonText={isSubmitting ? t('addingGroupSession') : t('createGroupSession')}
                />
            </DialogContent>
        </Dialog>
    );
}