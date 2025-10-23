import { useState } from 'react';
import { trpc as trpcMock } from '../../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useRegisterCoachToGroupPresenter } from '../../../../hooks/use-register-coach-to-group-presenter';

export function useGroupMutations(
    courseSlug: string, 
    onRefetch?: () => Promise<void>, 
    onCoachRegistered?: (groupId: string, coachId: string) => void
) {
    // View models for mutation results
    const [registerCoachViewModel, setRegisterCoachViewModel] = useState<viewModels.TRegisterCoachToGroupViewModel | undefined>(undefined);

    // Presenters for transforming mutation results
    const { presenter: registerCoachPresenter } = useRegisterCoachToGroupPresenter(setRegisterCoachViewModel);

    // Mutations for group operations
    const registerCoachMutation = trpcMock.registerCoachToGroup.useMutation();

    const registerCoachToGroup = async (
        groupId: string, 
        coachId: string
    ): Promise<{ success: boolean; data?: any; errorType?: string; message?: string }> => {
        try {
            // Reset view model before new operation
            setRegisterCoachViewModel(undefined);

            // TODO: Perform the backend operation - replace with actual backend call
            const result = await registerCoachMutation.mutateAsync({
                groupId,
                coachId
            });

            // TODO: Use presenter to transform the result when backend is ready
            // await registerCoachPresenter.present(result, registerCoachViewModel);

            // For now, handle the simple result directly
            if (result && onCoachRegistered) {
                onCoachRegistered(groupId, coachId);
            }
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Failed to register coach to group:', error);
            const errorMessage = 'Failed to register coach to group. Please try again.';
            return { 
                success: false,
                message: errorMessage 
            };
        }
    };

    const clearError = () => {
        setRegisterCoachViewModel(undefined);
    };

    return {
        registerCoachToGroup,
        isLoading: registerCoachMutation.isPending,
        clearError,
        registerCoachViewModel,
    };
}