import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseIntroductionPresenter, {
    TCourseIntroductionPresenterUtilities,
} from '../../common/presenters/course-introduction-presenter';

export function useGetCourseIntroductionPresenter(
    setViewModel: (viewModel: viewModels.TCourseIntroductionViewModel) => void,
) {
    const presenterUtilities: TCourseIntroductionPresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseIntroductionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
