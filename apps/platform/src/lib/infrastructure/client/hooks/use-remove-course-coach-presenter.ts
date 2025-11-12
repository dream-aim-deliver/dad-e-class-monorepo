import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import RemoveCourseCoachPresenter, {
    TRemoveCourseCoachPresenterUtilities,
} from '../../common/presenters/remove-course-coach-presenter';

export function useRemoveCourseCoachPresenter(
    setViewModel: (viewModel: viewModels.TRemoveCourseCoachViewModel) => void,
) {
    const presenterUtilities: TRemoveCourseCoachPresenterUtilities = {};
    const presenter = useMemo(
        () => new RemoveCourseCoachPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
