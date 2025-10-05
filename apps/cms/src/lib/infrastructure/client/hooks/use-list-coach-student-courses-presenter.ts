import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachStudentCoursesPresenter, {
    TListCoachStudentCoursesPresenterUtilities,
} from '../../common/presenters/list-coach-student-courses-presenter';

export function useListCoachStudentCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListCoachStudentCoursesViewModel) => void,
) {
    const presenterUtilities: TListCoachStudentCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachStudentCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
