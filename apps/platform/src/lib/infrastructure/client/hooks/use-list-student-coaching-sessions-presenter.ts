import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListStudentCoachingSessionsPresenter, { TStudentCoachingSessionsPresenterUtilities } from '../../common/presenters/list-student-coaching-sessions-presenter';

export function useListStudentCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TStudentCoachingSessionsListViewModel) => void,
) {
    const presenterUtilities: TStudentCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListStudentCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}