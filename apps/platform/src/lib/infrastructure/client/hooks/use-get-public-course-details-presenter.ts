import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPublicCourseDetailsPresenter, {
    TGetPublicCourseDetailsPresenterUtilities,
} from '../../common/presenters/get-public-course-details-presenter';

export function useGetPublicCourseDetailsPresenter(
    setViewModel: (viewModel: viewModels.TGetPublicCourseDetailsViewModel) => void,
) {
    const presenterUtilities: TGetPublicCourseDetailsPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPublicCourseDetailsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
