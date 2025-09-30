import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListStudentInteractionsPresenter, {
    TListStudentInteractionsPresenterUtilities,
} from '../../common/presenters/list-student-interactions-presenter';

export function useListStudentInteractionsPresenter(
    setViewModel: (viewModel: viewModels.TListStudentInteractionsViewModel) => void,
) {
    const presenterUtilities: TListStudentInteractionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListStudentInteractionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}