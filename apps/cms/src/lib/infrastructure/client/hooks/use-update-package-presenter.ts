import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdatePackagePresenter, {
    TUpdatePackagePresenterUtilities,
} from '../../common/presenters/update-package-presenter';

export function useUpdatePackagePresenter(
    setViewModel: (viewModel: viewModels.TUpdatePackageViewModel) => void,
) {
    const presenterUtilities: TUpdatePackagePresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdatePackagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
