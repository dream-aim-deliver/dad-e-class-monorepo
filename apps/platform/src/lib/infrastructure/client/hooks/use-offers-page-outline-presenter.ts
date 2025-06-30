import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import OffersPageOutlinePresenter, {
    TOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/offers-page-outline-presenter';
import { useDefaultPresenterUtilities } from '../utils/use-default-presenter-utilities';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TOffersPageOutlineViewModel) => void,
) {
    const presenterUtilities: TOffersPageOutlinePresenterUtilities =
        useDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new OffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
