import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import OffersPagePackagesPresenter, {
    TOffersPagePackagesPresenterUtilities,
} from '../../common/presenters/offers-page-packages-presenter';

export function useListOffersPagePackagesPresenter(
    setViewModel: (
        viewModel: viewModels.TOffersPagePackageListViewModel,
    ) => void,
) {
    const presenterUtilities: TOffersPagePackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new OffersPagePackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
