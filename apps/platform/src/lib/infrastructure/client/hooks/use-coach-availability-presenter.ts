import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachAvailabilityPresenter, {
    TCoachAvailabilityPresenterUtilities,
} from '../../common/presenters/coach-availability-presenter';

export function useGetCoachAvailabilityPresenter(
    setViewModel: (viewModel: viewModels.TCoachAvailabilityViewModel) => void,
) {
    const presenterUtilities: TCoachAvailabilityPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachAvailabilityPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
