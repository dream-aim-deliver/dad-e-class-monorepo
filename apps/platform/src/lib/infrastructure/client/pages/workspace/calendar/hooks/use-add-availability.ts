import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';

interface NewAvailability {
    startTime?: Date;
    endTime?: Date;
}

interface UseAddAvailabilityProps {
    onSuccess?: () => void;
}

export function useAddAvailability({ onSuccess }: UseAddAvailabilityProps = {}) {
    const [newAvailability, setNewAvailability] = useState<NewAvailability>({
        startTime: undefined,
        endTime: undefined,
    });
    const [error, setError] = useState<string | undefined>(undefined);

    const utils = trpc.useUtils();

    const addAvailabilityMutation = trpc.addAvailability.useMutation({
        onSuccess: () => {
            // Invalidate coach availability to show updated availability
            utils.getCoachAvailability.invalidate();
        },
    });

    const setStartTime = (date: Date) => {
        setNewAvailability((prev) => ({ ...prev, startTime: date }));
    };

    const setEndTime = (date: Date) => {
        setNewAvailability((prev) => ({ ...prev, endTime: date }));
    };

    const reset = () => {
        setNewAvailability({ startTime: undefined, endTime: undefined });
        setError(undefined);
    };

    const validateAndSubmit = () => {
        if (!newAvailability.startTime || !newAvailability.endTime) {
            setError('Please select both start and end times.');
            return;
        }
        if (newAvailability.startTime >= newAvailability.endTime) {
            setError('End time must be after start time.');
            return;
        }
        if (newAvailability.startTime < new Date()) {
            setError('Cannot add availability in the past.');
            return;
        }

        setError(undefined);

        addAvailabilityMutation.mutate(
            {
                slots: [{
                    startTime: newAvailability.startTime.toISOString(),
                    endTime: newAvailability.endTime.toISOString(),
                }],
            },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        reset();
                        onSuccess?.();
                    } else {
                        // TODO: Extract from result
                        setError('Failed to add availability');
                    }
                },
                onError: () => {
                    setError('Failed to add availability');
                },
            },
        );
    };

    return {
        newAvailability,
        startTime: newAvailability.startTime,
        endTime: newAvailability.endTime,
        setStartTime,
        setEndTime,
        error,
        isSubmitting: addAvailabilityMutation.isPending,
        validateAndSubmit,
        reset,
    };
}
