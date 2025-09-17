import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoachesPresenter, {
    TCoachesPresenterUtilities,
} from '../../common/presenters/coaches-presenter';

export function useListCoachesPresenter(
    setViewModel: (viewModel: viewModels.TCoachListViewModel) => void,
) {
    const presenterUtilities: TCoachesPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoachesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
