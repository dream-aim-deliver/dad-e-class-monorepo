import { viewModels } from '@maany_shr/e-class-models';
import CourseReviewsPresenter from '../../common/presenters/course-reviews-presenter';

export function createListCourseReviewsPresenter(
    setViewModel: (viewModel: viewModels.TCourseReviewsViewModel) => void,
) {
    return new CourseReviewsPresenter(setViewModel, {});
}
