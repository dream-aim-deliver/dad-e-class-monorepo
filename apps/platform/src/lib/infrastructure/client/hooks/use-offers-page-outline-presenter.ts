import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import OffersPageOutlinePresenter, {
    TOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/offers-page-outline-presenter';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TOffersPageOutlineViewModel) => void,
) {
    const presenterUtilities: TOffersPageOutlinePresenterUtilities = {};
    const presenter = useMemo(
        () => new OffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
