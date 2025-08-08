import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseStructurePresenter, {
    TCourseStructurePresenterUtilities,
} from '../../common/presenters/course-structure-presenter';

export function useGetCourseStructurePresenter(
    setViewModel: (viewModel: viewModels.TCourseStructureViewModel) => void,
) {
    const presenterUtilities: TCourseStructurePresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseStructurePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
