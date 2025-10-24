import GetHomePagePresenter, {
    TGetHomePagePresenterUtilities,
} from '../../common/presenters/get-home-page-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';

export function useGetHomePagePresenter(
    setViewModel: (viewModel: viewModels.TGetHomePageViewModel) => void,
) {
    const presenterUtilities: TGetHomePagePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetHomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
