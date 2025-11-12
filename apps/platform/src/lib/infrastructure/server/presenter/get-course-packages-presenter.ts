import { viewModels } from '@maany_shr/e-class-models';
import GetCoursePackagesPresenter from '../../common/presenters/get-course-packages-presenter';

export function createGetCoursePackagesPresenter(
    setViewModel: (viewModel: viewModels.TGetCoursePackagesViewModel) => void,
) {
    return new GetCoursePackagesPresenter(setViewModel, {});
}
