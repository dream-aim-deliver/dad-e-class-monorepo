import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoachingPagePresenter, {
    TGetCoachingPagePresenterUtilities,
} from '../../common/presenters/get-coaching-page-presenter';

export function useGetCoachingPagePresenter(
    setViewModel: (viewModel: viewModels.TGetCoachingPageViewModel) => void,
) {
    const presenterUtilities: TGetCoachingPagePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoachingPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
