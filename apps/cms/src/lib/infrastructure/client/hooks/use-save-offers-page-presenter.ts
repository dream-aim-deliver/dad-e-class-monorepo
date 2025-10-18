import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveOffersPagePresenter, {
    TSaveOffersPagePresenterUtilities,
} from '../../common/presenters/save-offers-page-presenter';

export function useSaveOffersPagePresenter(
    setViewModel: (viewModel: viewModels.TSaveOffersPageViewModel) => void,
) {
    const presenterUtilities: TSaveOffersPagePresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveOffersPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
