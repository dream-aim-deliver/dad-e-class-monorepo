import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ProcessPurchasePresenter, {
    TProcessPurchasePresenterUtilities,
} from '../../common/presenters/process-purchase-presenter';

export function useProcessPurchasePresenter(
    setViewModel: (viewModel: viewModels.TProcessPurchaseViewModel) => void,
) {
    const presenterUtilities: TProcessPurchasePresenterUtilities = {};
    const presenter = useMemo(
        () => new ProcessPurchasePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}

