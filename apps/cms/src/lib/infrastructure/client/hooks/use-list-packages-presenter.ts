import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPackagesPresenter, {
    TListPackagesPresenterUtilities,
} from '../../common/presenters/list-packages-presenter';

export function useListPackagesPresenter(
    setViewModel: (viewModel: viewModels.TListPackagesViewModel) => void,
) {
    const presenterUtilities: TListPackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
