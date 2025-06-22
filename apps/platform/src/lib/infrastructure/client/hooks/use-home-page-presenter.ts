import HomePagePresenter, {
    THomePagePresenterUtilities,
} from '../../common/presenters/home-page-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';

export function useGetHomePagePresenter(
    setViewModel: (viewModel: viewModels.THomePageViewModel) => void,
) {
    const presenterUtilities: THomePagePresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new HomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
