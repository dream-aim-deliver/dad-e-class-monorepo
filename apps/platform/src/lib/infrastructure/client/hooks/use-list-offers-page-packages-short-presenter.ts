import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListOffersPagePackagesShortPresenter, {
    TListOffersPagePackagesShortPresenterUtilities,
} from '../../common/presenters/list-offers-page-packages-short-presenter';

export function useListOffersPagePackagesShortPresenter(
    setViewModel: (viewModel: viewModels.TListOffersPagePackagesShortViewModel) => void,
) {
    const presenterUtilities: TListOffersPagePackagesShortPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListOffersPagePackagesShortPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
