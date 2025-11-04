import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListStudentCoursesPresenter, {
    TListStudentCoursesPresenterUtilities,
} from '../../common/presenters/list-student-courses-presenter';

export function useListStudentCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListStudentCoursesViewModel) => void,
) {
    const presenterUtilities: TListStudentCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListStudentCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
