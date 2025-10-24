import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetOffersPageOutlinePresenter, {
    TOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/get-offers-page-outline-presenter';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TGetOffersPageOutlineViewModel) => void,
) {
    const presenterUtilities: TOffersPageOutlinePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetOffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
