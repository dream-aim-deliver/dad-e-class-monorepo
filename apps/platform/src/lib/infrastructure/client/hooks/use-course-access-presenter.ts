import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseAccessPresenter, {
    TCourseAccessPresenterUtilities,
} from '../../common/presenters/course-access-presenter';

export function useGetCourseAccessPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseAccessViewModel) => void,
) {
    const presenterUtilities: TCourseAccessPresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseAccessPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
