import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UnscheduleCoachingSessionPresenter, {
    TUnscheduleCoachingSessionPresenterUtilities,
} from '../../common/presenters/unschedule-coaching-session-presenter';

export function useUnscheduleCoachingSessionPresenter(
    setViewModel: (viewModel: viewModels.TUnscheduleCoachingSessionViewModel) => void,
) {
    const presenterUtilities: TUnscheduleCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new UnscheduleCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
