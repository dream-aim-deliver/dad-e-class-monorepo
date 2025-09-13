import { viewModels } from '@maany_shr/e-class-models';
import CourseOutlinePresenter from '../../common/presenters/course-outline-presenter';

export function createGetCourseOutlinePresenter(
    setViewModel: (viewModel: viewModels.TCourseOutlineViewModel) => void,
) {
    return new CourseOutlinePresenter(setViewModel, {});
}
