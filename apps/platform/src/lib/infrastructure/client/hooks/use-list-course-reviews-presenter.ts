import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseReviewsPresenter, {
    TCourseReviewsPresenterUtilities,
} from '../../common/presenters/course-reviews-presenter';

export function useListCourseReviewsPresenter(
    setViewModel: (viewModel: viewModels.TCourseReviewsViewModel) => void,
) {
    const presenterUtilities: TCourseReviewsPresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseReviewsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
