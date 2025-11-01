import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoursePackagesPresenter, {
    TCoursePackagesPresenterUtilities,
} from '../../common/presenters/course-packages-presenter';

export function useGetCoursePackagesPresenter(
    setViewModel: (viewModel: viewModels.TGetCoursePackagesViewModel) => void,
) {
    const presenterUtilities: TCoursePackagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoursePackagesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
