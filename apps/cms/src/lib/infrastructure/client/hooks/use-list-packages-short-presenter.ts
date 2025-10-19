import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPackagesShortPresenter, {
    TListPackagesShortPresenterUtilities,
} from '../../common/presenters/list-packages-short-presenter';

export function useListPackagesShortPresenter(
    setViewModel: (viewModel: viewModels.TListPackagesShortViewModel) => void,
) {
    const presenterUtilities: TListPackagesShortPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPackagesShortPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
