import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { useAvailabilityErrors, AvailabilityErrorType } from '../../../../hooks/use-availability-errors';

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
    const [error, setError] = useState<{ title: string; description: string } | undefined>(undefined);
    const { getAvailabilityErrorMessage } = useAvailabilityErrors();

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
            setError(getAvailabilityErrorMessage(AvailabilityErrorType.MISSING_TIMES));
            return;
        }
        if (newAvailability.startTime >= newAvailability.endTime) {
            setError(getAvailabilityErrorMessage(AvailabilityErrorType.INVALID_TIME_RANGE));
            return;
        }
        if (newAvailability.startTime < new Date()) {
            setError(getAvailabilityErrorMessage(AvailabilityErrorType.PAST_TIME));
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
                        setError(getAvailabilityErrorMessage(AvailabilityErrorType.GENERIC_ERROR));
                    }
                },
                onError: () => {
                    setError(getAvailabilityErrorMessage(AvailabilityErrorType.GENERIC_ERROR));
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
