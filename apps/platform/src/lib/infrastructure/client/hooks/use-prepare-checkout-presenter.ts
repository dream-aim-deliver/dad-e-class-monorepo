import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PrepareCheckoutPresenter, {
    TPrepareCheckoutPresenterUtilities,
} from '../../common/presenters/prepare-checkout-presenter';

export function usePrepareCheckoutPresenter(
    setViewModel: (viewModel: viewModels.TPrepareCheckoutViewModel) => void,
) {
    const presenterUtilities: TPrepareCheckoutPresenterUtilities = {};
    const presenter = useMemo(
        () => new PrepareCheckoutPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
