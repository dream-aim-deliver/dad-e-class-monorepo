import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoachingPagePresenter, {
    TCoachingPagePresenterUtilities,
} from '../../common/presenters/get-coaching-page-presenter';

export function useGetCoachingPagePresenter(
    setViewModel: (viewModel: viewModels.TCoachingPageViewModel) => void,
) {
    const presenterUtilities: TCoachingPagePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoachingPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
