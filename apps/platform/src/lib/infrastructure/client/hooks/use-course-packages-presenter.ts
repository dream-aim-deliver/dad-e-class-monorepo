import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoursePackagesPresenter, {
    TGetCoursePackagesPresenterUtilities,
} from '../../common/presenters/get-course-packages-presenter';

export function useGetCoursePackagesPresenter(
    setViewModel: (viewModel: viewModels.TGetCoursePackagesViewModel) => void,
) {
    const presenterUtilities: TGetCoursePackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoursePackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
