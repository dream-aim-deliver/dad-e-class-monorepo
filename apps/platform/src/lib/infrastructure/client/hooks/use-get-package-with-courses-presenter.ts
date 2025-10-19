import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPackageWithCoursesPresenter, {
    TGetPackageWithCoursesPresenterUtilities,
} from '../../common/presenters/get-package-with-courses-presenter';

export function useGetPackageWithCoursesPresenter(
    setViewModel: (viewModel: viewModels.TGetPackageWithCoursesViewModel) => void,
) {
    const presenterUtilities: TGetPackageWithCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPackageWithCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
