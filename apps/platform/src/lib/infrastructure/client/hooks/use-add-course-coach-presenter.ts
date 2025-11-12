import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AddCourseCoachPresenter, {
    TAddCourseCoachPresenterUtilities,
} from '../../common/presenters/add-course-coach-presenter';

export function useAddCourseCoachPresenter(
    setViewModel: (viewModel: viewModels.TAddCourseCoachViewModel) => void,
) {
    const presenterUtilities: TAddCourseCoachPresenterUtilities = {};
    const presenter = useMemo(
        () => new AddCourseCoachPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
