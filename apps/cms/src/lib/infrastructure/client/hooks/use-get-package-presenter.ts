import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPackagePresenter, {
    TGetPackagePresenterUtilities,
} from '../../common/presenters/get-package-presenter';

export function useGetPackagePresenter(
    setViewModel: (viewModel: viewModels.TGetPackageViewModel) => void,
) {
    const presenterUtilities: TGetPackagePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPackagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
