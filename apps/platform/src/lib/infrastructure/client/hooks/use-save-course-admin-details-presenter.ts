import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveCourseAdminDetailsPresenter, {
    TSaveCourseAdminDetailsPresenterUtilities,
} from '../../common/presenters/save-course-admin-details-presenter';

export function useSaveCourseAdminDetailsPresenter(
    setViewModel: (viewModel: viewModels.TSaveCourseAdminDetailsViewModel) => void,
) {
    const presenterUtilities: TSaveCourseAdminDetailsPresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveCourseAdminDetailsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
