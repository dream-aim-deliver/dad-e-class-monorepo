import { viewModels } from '@maany_shr/e-class-models';
import ListCourseReviewsPresenter from '../../common/presenters/list-course-reviews-presenter';

export function createListCourseReviewsPresenter(
    setViewModel: (viewModel: viewModels.TListCourseReviewsViewModel) => void,
) {
    return new ListCourseReviewsPresenter(setViewModel, {});
}
