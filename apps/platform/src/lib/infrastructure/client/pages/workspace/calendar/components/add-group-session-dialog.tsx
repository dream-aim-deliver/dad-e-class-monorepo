'use client';

import {
    Dialog,
    DialogContent,
} from '@maany_shr/e-class-ui-kit';
import GroupSessionTimeContent from '../../../common/group-session-time-content';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import React from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { useSchedulingErrors, getSchedulingErrorKey } from '../../../../hooks/use-scheduling-errors';

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
    groupId: number;
    coachUsername: string;
}

export function AddGroupSessionDialog({
    isOpen,
    onOpenChange,
    onSuccess,
    initialStartTime,
    groupId,
    coachUsername,
}: AddGroupSessionDialogProps) {
    const t = useTranslations('pages.calendarPage');
    const { getSchedulingErrorMessage } = useSchedulingErrors();
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
            const sessionData = {
                startTime: startTime.toISOString(),
                coachingOfferingTitle: selectedOffering.name,
                coachingOfferingDuration: selectedOffering.duration,
                groupId,
                coachUsername,
            };

            await createGroupCoachingSessionMutation.mutateAsync(sessionData);

            onSuccess();
        } catch (err: unknown) {
            // Extract error type and message from the error response
            let errorType: string | undefined;
            let errorMessage: string | undefined;

            if (err && typeof err === 'object') {
                // Try to extract error_type from various possible locations
                const errorObj = err as Record<string, unknown>;

                // Check for error_type in data.context
                if (errorObj.data && typeof errorObj.data === 'object') {
                    const data = errorObj.data as Record<string, unknown>;
                    if (data.context && typeof data.context === 'object') {
                        const context = data.context as Record<string, unknown>;
                        errorType = context.error_type as string | undefined;
                    }
                }

                // Check for message
                if ('message' in errorObj) {
                    errorMessage = errorObj.message as string;
                }
            }

            // Use the scheduling errors hook to get localized error message
            const { title, description } = getSchedulingErrorMessage(errorType, errorMessage);
            setError(`${title}: ${description}`);
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
                className="overflow-visible"
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