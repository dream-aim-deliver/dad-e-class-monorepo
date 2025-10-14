import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ArchivePackagePresenter, {
    TArchivePackagePresenterUtilities,
} from '../../common/presenters/archive-package-presenter';

export function useArchivePackagePresenter(
    setViewModel: (viewModel: viewModels.TArchivePackageViewModel) => void,
) {
    const presenterUtilities: TArchivePackagePresenterUtilities = {};
    const presenter = useMemo(
        () => new ArchivePackagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
