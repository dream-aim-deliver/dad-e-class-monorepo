import HomePagePresenter, {
    THomePagePresenterUtilities,
} from '../../common/presenters/home-page-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';

export function useGetHomePagePresenter(
    setViewModel: (viewModel: viewModels.THomePageViewModel) => void,
) {
    const presenterUtilities: THomePagePresenterUtilities = {};
    const presenter = useMemo(
        () => new HomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
