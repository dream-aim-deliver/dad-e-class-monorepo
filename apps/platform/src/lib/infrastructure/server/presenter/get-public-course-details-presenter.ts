import { viewModels } from '@maany_shr/e-class-models';
import GetPublicCourseDetailsPresenter from '../../common/presenters/get-public-course-details-presenter';

export function createGetPublicCourseDetailsPresenter(
    setViewModel: (viewModel: viewModels.TGetPublicCourseDetailsViewModel) => void,
) {
    return new GetPublicCourseDetailsPresenter(setViewModel, {});
}
