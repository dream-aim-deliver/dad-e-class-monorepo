import { viewModels } from '@maany_shr/e-class-models';
import PublicCourseDetailsPresenter from '../../common/presenters/public-course-details-presenter';

export function createGetPublicCourseDetailsPresenter(
    setViewModel: (viewModel: viewModels.TPublicCourseDetailsViewModel) => void,
) {
    return new PublicCourseDetailsPresenter(setViewModel, {});
}
