import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import OffersPageOutlinePresenter, {
    TGetOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/get-offers-page-outline-presenter';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TGetOffersPageOutlineViewModel) => void,
) {
    const presenterUtilities: TGetOffersPageOutlinePresenterUtilities = {};
    const presenter = useMemo(
        () => new OffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
