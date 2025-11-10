import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PublicCourseDetailsPresenter, {
    TPublicCourseDetailsPresenterUtilities,
} from '../../common/presenters/public-course-details-presenter';

export function useGetPublicCourseDetailsPresenter(
    setViewModel: (viewModel: viewModels.TPublicCourseDetailsViewModel) => void,
) {
    const presenterUtilities: TPublicCourseDetailsPresenterUtilities = {};
    const presenter = useMemo(
        () => new PublicCourseDetailsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
