import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';

interface UseDeleteAvailabilityProps {
    onSuccess?: () => void;
}

export function useDeleteAvailability({ onSuccess }: UseDeleteAvailabilityProps = {}) {
    const [error, setError] = useState<string | undefined>(undefined);

    const utils = trpc.useUtils();

    const deleteAvailabilityMutation = trpc.deleteAvailability.useMutation({
        onSuccess: () => {
            // Invalidate coach availability to show updated availability
            utils.getCoachAvailability.invalidate();
        },
    });

    const deleteAvailability = (availabilityId: number) => {
        setError(undefined);

        deleteAvailabilityMutation.mutate(
            {
                availabilityIds: [availabilityId]
            },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        onSuccess?.();
                    } else {
                        // TODO: Extract error from result
                        setError('Failed to delete availability');
                    }
                },
                onError: () => {
                    setError('Failed to delete availability');
                },
            },
        );
    };

    return {
        error,
        deleteAvailability,
        isPending: deleteAvailabilityMutation.isPending,
    };
}
