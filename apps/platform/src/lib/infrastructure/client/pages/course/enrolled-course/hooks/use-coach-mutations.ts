import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';

import { useAddCourseCoachPresenter } from '../../../../hooks/use-add-course-coach-presenter';
import { useRemoveCourseCoachPresenter } from '../../../../hooks/use-remove-course-coach-presenter';

export function useCoachMutations(courseSlug: string, onRefetch?: () => Promise<void>, onCoachAdded?: (coach: any) => void, onCoachRemoved?: (coachId: number) => void) {

    // View models for mutation results
    const [addCoachViewModel, setAddCoachViewModel] = useState<viewModels.TAddCourseCoachViewModel | undefined>(undefined);
    const [removeCoachViewModel, setRemoveCoachViewModel] = useState<viewModels.TRemoveCourseCoachViewModel | undefined>(undefined);

    // Presenters for transforming mutation results
    const { presenter: addCoachPresenter } = useAddCourseCoachPresenter(setAddCoachViewModel);
    const { presenter: removeCoachPresenter } = useRemoveCourseCoachPresenter(setRemoveCoachViewModel);

    // Get TRPC utils for query invalidation
    const utils = trpc.useUtils();

    // Mutations for add/remove coaches with query invalidation
    const addCoachMutation = trpc.addCourseCoach.useMutation({
        onSuccess: () => {
            // Invalidate the course coaches query to refresh the list
            utils.listCoaches.invalidate({ courseSlug });
        },
    });
    const removeCoachMutation = trpc.removeCourseCoach.useMutation({
        onSuccess: () => {
            // Invalidate the course coaches query to refresh the list
            utils.listCoaches.invalidate({ courseSlug });
        },
    });

    const addCoach = async (coachId: number): Promise<{ success: boolean; addedCoach?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setAddCoachViewModel(undefined);

            // Perform the backend operation
            const result = await addCoachMutation.mutateAsync({
                courseSlug,
                coachId
            });

            // Use presenter to transform the result (this updates state asynchronously)
            // @ts-ignore
            await addCoachPresenter.present(result, addCoachViewModel);

            // Since presenter updates the state, we need to handle the result directly
            // Let's check the mutation result instead of relying on state
            if (result.success) {
                const addedCoach = (result as any).data.addedCoach;
                if (addedCoach && onCoachAdded) {
                    onCoachAdded(addedCoach);
                }
                return {
                    success: true,
                    addedCoach: addedCoach
                };
            } else {
                // Handle error case from result directly
                const errorMessage = (result as any).data?.message;
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

    const removeCoach = async (coachId: number): Promise<{ success: boolean; removedCoach?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setRemoveCoachViewModel(undefined);

            // Perform backend operation
            const result = await removeCoachMutation.mutateAsync({
                courseSlug,
                coachId
            });

            // Use presenter to transform the result (this updates state asynchronously)
            // @ts-ignore
            await removeCoachPresenter.present(result, removeCoachViewModel);

            // Since presenter updates the state, we need to handle the result directly
            // Let's check the mutation result instead of relying on state
            if (result.success) {
                const removedCoach = (result as any).data.removedCoach;
                if (removedCoach && onCoachRemoved) {
                    onCoachRemoved(removedCoach.id);
                }
                return {
                    success: true,
                    removedCoach: removedCoach
                };
            } else {
                // Handle error case from result directly
                const errorMessage = (result as any).data?.message || 'Failed to remove coach';
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
