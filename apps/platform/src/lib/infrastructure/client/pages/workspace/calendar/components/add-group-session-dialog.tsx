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
            // Handle specific error types for better user feedback
            if (err && typeof err === 'object' && 'message' in err) {
                const errorMessage = (err as { message: string }).message;

                // Check for common error patterns
                if (errorMessage.includes('conflict') || errorMessage.includes('already exists')) {
                    setError('A session already exists at this time. Please choose a different time slot.');
                } else if (errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
                    setError('You do not have permission to create sessions for this group.');
                } else if (errorMessage.includes('not found')) {
                    setError('The group or coaching offering could not be found.');
                } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
                    setError('Invalid session data. Please check your inputs and try again.');
                } else {
                    // Use the actual error message if it's user-friendly, otherwise fallback
                    setError(errorMessage.length < 100 ? errorMessage : 'Failed to create group coaching session. Please try again.');
                }
            } else {
                setError('Failed to create group coaching session. Please try again.');
            }
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