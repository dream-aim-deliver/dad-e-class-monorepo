import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ScheduleCoachingSessionPresenter, {
    TScheduleCoachingSessionPresenterUtilities,
} from '../../common/presenters/schedule-coaching-session-presenter';

export function useScheduleCoachingSessionPresenter(
    setViewModel: (viewModel: viewModels.TScheduleCoachingSessionViewModel) => void,
) {
    const presenterUtilities: TScheduleCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new ScheduleCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
