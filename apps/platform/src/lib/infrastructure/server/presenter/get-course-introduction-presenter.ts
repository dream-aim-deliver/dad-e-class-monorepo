import { viewModels } from '@maany_shr/e-class-models';
import CourseIntroductionPresenter from '../../common/presenters/course-introduction-presenter';

export function createGetCourseIntroductionPresenter(
    setViewModel: (viewModel: viewModels.TCourseIntroductionViewModel) => void,
) {
    return new CourseIntroductionPresenter(setViewModel, {});
}
