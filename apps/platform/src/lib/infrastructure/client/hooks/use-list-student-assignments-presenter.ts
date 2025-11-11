import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListStudentAssignmentsPresenter, {
    TListStudentAssignmentsPresenterUtilities,
} from '../../common/presenters/list-student-assignments-presenter';

export function useListStudentAssignmentsPresenter(
    setViewModel: (viewModel: viewModels.TListStudentAssignmentsViewModel) => void,
) {
    const presenterUtilities: TListStudentAssignmentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListStudentAssignmentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
