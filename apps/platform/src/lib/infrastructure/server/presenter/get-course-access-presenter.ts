import { viewModels } from '@maany_shr/e-class-models';
import CourseAccessPresenter from '../../common/presenters/course-access-presenter';

export function createGetCourseAccessPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseAccessViewModel) => void,
) {
    return new CourseAccessPresenter(setViewModel, {});
}
