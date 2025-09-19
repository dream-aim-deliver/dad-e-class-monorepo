import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachingOfferingsPresenter, {
    TCoachingOfferingsPresenterUtilities,
} from '../../common/presenters/coach-coaching-session-preseneter';

export function useListCoachCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TCoachCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TCoachingOfferingsPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachingOfferingsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
