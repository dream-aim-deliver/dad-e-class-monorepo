import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachingOfferingsPresenter, {
    TCoachCoachingSessionsPresenterUtilities,
} from '../../common/presenters/coach-coaching-session-preseneter';

export function useListCoachCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TCoachCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TCoachCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachingOfferingsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
