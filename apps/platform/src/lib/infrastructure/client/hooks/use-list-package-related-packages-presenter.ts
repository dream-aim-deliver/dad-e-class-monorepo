import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPackageRelatedPackagesPresenter, {
    TListPackageRelatedPackagesPresenterUtilities,
} from '../../common/presenters/list-package-related-packages-presenter';

export function useListPackageRelatedPackagesPresenter(
    setViewModel: (viewModel: viewModels.TListPackageRelatedPackagesViewModel) => void,
) {
    const presenterUtilities: TListPackageRelatedPackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPackageRelatedPackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
