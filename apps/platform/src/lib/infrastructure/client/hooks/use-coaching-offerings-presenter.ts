import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachingOfferingsPresenter, {
    TCoachingOfferingsPresenterUtilities,
} from '../../common/presenters/coaching-offerings-presenter';

export function useListCoachingOfferingsPresenter(
    setViewModel: (
        viewModel: viewModels.TCoachingOfferingListViewModel,
    ) => void,
) {
    const presenterUtilities: TCoachingOfferingsPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachingOfferingsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
