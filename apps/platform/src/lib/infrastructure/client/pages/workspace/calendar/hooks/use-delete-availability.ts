import { useState } from 'react';
import { trpc } from '../../../../trpc/client';

interface UseDeleteAvailabilityProps {
    onSuccess?: () => void;
}

export function useDeleteAvailability({ onSuccess }: UseDeleteAvailabilityProps = {}) {
    const [error, setError] = useState<string | undefined>(undefined);
    const deleteAvailabilityMutation = trpc.deleteAvailability.useMutation();

    const deleteAvailability = (availabilityId: number) => {
        setError(undefined);

        deleteAvailabilityMutation.mutate(
            {
                availabilityId: availabilityId
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
