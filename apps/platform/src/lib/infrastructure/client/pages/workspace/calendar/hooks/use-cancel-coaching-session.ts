import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useUnscheduleCoachingSessionPresenter } from '../../../../hooks/use-unschedule-coaching-session-presenter';

interface UseCancelCoachingSessionProps {
    onSuccess?: () => void;
}

export function useCancelCoachingSession({ onSuccess }: UseCancelCoachingSessionProps = {}) {
    const [error, setError] = useState<string | undefined>(undefined);
    const [isError, setIsError] = useState(false);

    const [unscheduleViewModel, setUnscheduleViewModel] =
        useState<viewModels.TUnscheduleCoachingSessionViewModel | undefined>(undefined);
    const { presenter: unschedulePresenter } = useUnscheduleCoachingSessionPresenter(
        setUnscheduleViewModel,
    );

    const utils = trpc.useUtils();

    const unscheduleMutation = trpc.unscheduleCoachingSession.useMutation();

    const cancelSession = async (coachingSessionId: number, reason: string) => {
        setError(undefined);
        setIsError(false);

        try {
            const response = await unscheduleMutation.mutateAsync({
                coachingSessionId,
                declineReason: reason,
            });

            // @ts-ignore
            unschedulePresenter.present(response, unscheduleViewModel);

            if (!response.success) {
                setError('Failed to cancel coaching session');
                setIsError(true);
                return;
            }

            // Invalidate related queries
            utils.getCoachAvailability.invalidate();
            utils.listCoachCoachingSessions.invalidate();
            utils.listStudentCoachingSessions.invalidate();
            utils.listAvailableCoachings.invalidate();
            utils.listGroupCoachingSessions.invalidate();

            onSuccess?.();
        } catch {
            setError('Failed to cancel coaching session');
            setIsError(true);
        }
    };

    return {
        cancelSession,
        isPending: unscheduleMutation.isPending,
        error,
        isError,
    };
}
