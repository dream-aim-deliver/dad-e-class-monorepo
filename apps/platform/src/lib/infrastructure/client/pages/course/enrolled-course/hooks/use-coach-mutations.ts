import { useState } from 'react';
import { trpc as trpcMock } from '../../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useAddCoachPresenter, useRemoveCoachPresenter } from '../../../../hooks/use-coach-mutations-presenter';

// Create a simple mapping function for usernames to numeric IDs
const getCoachNumericId = (username: string): number => {
    // Simple hash function to convert usernames to consistent numeric IDs
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export function useCoachMutations(courseSlug: string, onRefetch?: () => Promise<void>, onCoachAdded?: (coach: any) => void, onCoachRemoved?: (coachUsername: string) => void) {

    // View models for mutation results
    const [addCoachViewModel, setAddCoachViewModel] = useState<viewModels.TAddCoachViewModel | undefined>(undefined);
    const [removeCoachViewModel, setRemoveCoachViewModel] = useState<viewModels.TRemoveCoachViewModel | undefined>(undefined);

    // Presenters for transforming mutation results
    const { presenter: addCoachPresenter } = useAddCoachPresenter(setAddCoachViewModel);
    const { presenter: removeCoachPresenter } = useRemoveCoachPresenter(setRemoveCoachViewModel);

    // Mutations for add/remove coaches
    const addCoachMutation = trpcMock.addCourseCoach.useMutation();
    const removeCoachMutation = trpcMock.removeCourseCoach.useMutation();

    const addCoach = async (coachId: string): Promise<{ success: boolean; addedCoach?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setAddCoachViewModel(undefined);

            // Perform the backend operation
            const result = await addCoachMutation.mutateAsync({
                courseSlug,
                coachId: getCoachNumericId(coachId)
            });

            // Use presenter to transform the result
            addCoachPresenter.present(result, addCoachViewModel);

            // Handle the presented result
            if (addCoachViewModel?.mode === 'success') {
                const addedCoach = addCoachViewModel.data.addedCoach;
                if (addedCoach && onCoachAdded) {
                    onCoachAdded(addedCoach);
                }
                return {
                    success: true,
                    addedCoach: addedCoach
                };
            } else if (addCoachViewModel?.mode === 'error') {
                const errorMessage = addCoachViewModel.data.message;
                return { 
                    success: false, 
                    errorType: 'mutation_error', 
                    message: errorMessage 
                };
            }

            return { success: false };
        } catch (error) {
            console.error('Failed to add coach:', error);
            const errorMessage = 'Failed to add coach. Please try again.';
            return { 
                success: false, 
                errorType: 'network_error', 
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
                coachId: getCoachNumericId(coachId)
            });

            // Use presenter to transform the result
            removeCoachPresenter.present(result, removeCoachViewModel);

            // Handle the presented result
            if (removeCoachViewModel?.mode === 'success') {
                const removedCoach = removeCoachViewModel.data.removedCoach;
                if (removedCoach && onCoachRemoved) {
                    onCoachRemoved(removedCoach.username);
                }
                return {
                    success: true,
                    removedCoach: removedCoach
                };
            } else if (removeCoachViewModel?.mode === 'error') {
                const errorMessage = removeCoachViewModel.data.message;
                return { 
                    success: false, 
                    errorType: 'mutation_error', 
                    message: errorMessage 
                };
            }

            return { success: false };
        } catch (error) {
            console.error('Failed to remove coach:', error);
            const errorMessage = 'Failed to remove coach. Please try again.';
            return { 
                success: false, 
                errorType: 'network_error', 
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
