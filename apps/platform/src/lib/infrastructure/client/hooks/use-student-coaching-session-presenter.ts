import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import StudentCoachingSessionPresenter, {
    TStudentCoachingSessionPresenterUtilities,
} from '../../common/presenters/student-coaching-session-presenter';

export function useGetStudentCoachingSessionPresenter(
    setViewModel: (
        viewModel: viewModels.TStudentCoachingSessionViewModel,
    ) => void,
) {
    const presenterUtilities: TStudentCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new StudentCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    
    return { presenter };
}
