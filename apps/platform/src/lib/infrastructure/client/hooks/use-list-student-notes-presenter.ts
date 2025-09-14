import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListStudentNotesPresenter, {
    TStudentNotesPresenterUtilities,
} from '../../common/presenters/list-student-notes-presenter';

export function useListStudentNotesPresenter(
    setViewModel: (viewModel: viewModels.TStudentNotesViewModel) => void,
) {
    const presenterUtilities: TStudentNotesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListStudentNotesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
