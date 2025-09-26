import { viewModels } from '@maany_shr/e-class-models';
import CoursePackagesPresenter from '../../common/presenters/course-packages-presenter';

export function createGetCoursePackagesPresenter(
    setViewModel: (viewModel: viewModels.TCoursePackagesViewModel) => void,
) {
    return new CoursePackagesPresenter(setViewModel, {});
}
