import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachingPagePresenter, {
    TCoachingPagePresenterUtilities,
} from '../../common/presenters/coaching-page-presenter';

export function useGetCoachingPagePresenter(
    setViewModel: (viewModel: viewModels.TCoachingPageViewModel) => void,
) {
    const presenterUtilities: TCoachingPagePresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachingPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
