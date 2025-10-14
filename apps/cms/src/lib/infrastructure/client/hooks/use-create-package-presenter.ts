import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreatePackagePresenter, {
    TCreatePackagePresenterUtilities,
} from '../../common/presenters/create-package-presenter';

export function useCreatePackagePresenter(
    setViewModel: (viewModel: viewModels.TCreatePackageViewModel) => void,
) {
    const presenterUtilities: TCreatePackagePresenterUtilities = {};
    const presenter = useMemo(
        () => new CreatePackagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
