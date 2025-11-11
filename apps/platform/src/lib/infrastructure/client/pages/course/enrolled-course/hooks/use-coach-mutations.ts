import { useState } from 'react';
import { trpc as trpcMock } from '../../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';

import { useAddCoachPresenter, useRemoveCoachPresenter } from '../../../../hooks/use-coach-mutations-presenter';

export function useCoachMutations(courseSlug: string, onRefetch?: () => Promise<void>, onCoachAdded?: (coach: any) => void, onCoachRemoved?: (coachUsername: string) => void) {

    // View models for mutation results
    const [addCoachViewModel, setAddCoachViewModel] = useState<viewModels.TAddCoachViewModel | undefined>(undefined);
    const [removeCoachViewModel, setRemoveCoachViewModel] = useState<viewModels.TRemoveCoachViewModel | undefined>(undefined);

    // Presenters for transforming mutation results
    const { presenter: addCoachPresenter } = useAddCoachPresenter(setAddCoachViewModel);
    const { presenter: removeCoachPresenter } = useRemoveCoachPresenter(setRemoveCoachViewModel);

    // Mutations for add/remove coaches
    const addCoachMutation = trpcMock.addCourseCoach.useMutation({
        onSuccess: () => {
            // Trigger refetch callback to update coach list
            if (onRefetch) {
                onRefetch();
            }
        },
    });
    const removeCoachMutation = trpcMock.removeCourseCoach.useMutation({
        onSuccess: () => {
            // Trigger refetch callback to update coach list
            if (onRefetch) {
                onRefetch();
            }
        },
    });

    const addCoach = async (coachId: string): Promise<{ success: boolean; addedCoach?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setAddCoachViewModel(undefined);

            // Perform the backend operation
            const result = await addCoachMutation.mutateAsync({
                courseSlug,
                coachId
            });

            // Use presenter to transform the result (this updates state asynchronously)
            await addCoachPresenter.present(result, addCoachViewModel);

            // Since presenter updates the state, we need to handle the result directly
            // Let's check the mutation result instead of relying on state
            if (result.success) {
                const addedCoach = result.data.addedCoach;
                if (addedCoach && onCoachAdded) {
                    onCoachAdded(addedCoach);
                }
                return {
                    success: true,
                    addedCoach: addedCoach
                };
            } else {
                // Handle error case from result directly
                const errorMessage = result.data?.message;
                return { 
                    success: false,  
                    message: errorMessage 
                };
            }
        } catch (error) {
            console.error('Failed to add coach:', error);
            const errorMessage = 'Failed to add coach. Please try again.';
            return { 
                success: false,
                message: errorMessage 
            };
        }
    };

    const removeCoach = async (coachId: string): Promise<{ success: boolean; removedCoach?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setRemoveCoachViewModel(undefined);

            // Perform backend operation
            const result = await removeCoachMutation.mutateAsync({
                courseSlug,
                coachId
            });

            // Use presenter to transform the result (this updates state asynchronously)
            await removeCoachPresenter.present(result, removeCoachViewModel);

            // Since presenter updates the state, we need to handle the result directly
            // Let's check the mutation result instead of relying on state
            if (result.success) {
                const removedCoach = result.data.removedCoach;
                if (removedCoach && onCoachRemoved) {
                    onCoachRemoved(removedCoach.username);
                }
                return {
                    success: true,
                    removedCoach: removedCoach
                };
            } else {
                // Handle error case from result directly
                const errorMessage = result.data?.message || 'Failed to remove coach';
                return { 
                    success: false, 
                    message: errorMessage 
                };
            }
        } catch (error) {
            console.error('Failed to remove coach:', error);
            const errorMessage = 'Failed to remove coach. Please try again.';
            return { 
                success: false, 
                message: errorMessage 
            };
        }
    };

    return {
        addCoach,
        removeCoach,
        isLoading: addCoachMutation.isPending || removeCoachMutation.isPending,
        addCoachViewModel,
        removeCoachViewModel,
        clearError: () => {
            setAddCoachViewModel(undefined);
            setRemoveCoachViewModel(undefined);
        },
    };
}
