import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseShortPresenter, {
    TCourseShortPresenterUtilities,
} from '../../common/presenters/course-short-presenter';

export function useGetCourseShortPresenter(
    setViewModel: (viewModel: viewModels.TCourseShortViewModel) => void,
) {
    const presenterUtilities: TCourseShortPresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseShortPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
