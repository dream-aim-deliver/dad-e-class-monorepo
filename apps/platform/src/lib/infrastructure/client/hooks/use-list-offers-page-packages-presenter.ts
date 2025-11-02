import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListOffersPagePackagesPresenter, {
    TListOffersPagePackagesPresenterUtilities,
} from '../../common/presenters/list-offers-page-packages-presenter';

export function useListOffersPagePackagesPresenter(
    setViewModel: (viewModel: viewModels.TListOffersPagePackagesViewModel) => void,
) {
    const presenterUtilities: TListOffersPagePackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListOffersPagePackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
