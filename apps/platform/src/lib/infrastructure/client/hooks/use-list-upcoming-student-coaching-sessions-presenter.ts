import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUpcomingStudentCoachingSessionsPresenter, {
    TListUpcomingStudentCoachingSessionsPresenterUtilities,
} from '../../common/presenters/list-upcoming-student-coaching-sessions-presenter';

export function useListUpcomingStudentCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TListUpcomingStudentCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TListUpcomingStudentCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUpcomingStudentCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
