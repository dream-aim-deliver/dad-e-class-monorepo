import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseOutlinePresenter, {
    TCourseOutlinePresenterUtilities,
} from '../../common/presenters/course-outline-presenter';

export function useGetCourseOutlinePresenter(
    setViewModel: (viewModel: viewModels.TCourseOutlineViewModel) => void,
) {
    const presenterUtilities: TCourseOutlinePresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
