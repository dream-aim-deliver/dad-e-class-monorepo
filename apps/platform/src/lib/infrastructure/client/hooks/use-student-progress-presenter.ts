import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import StudentProgressPresenter, {
    TStudentProgressPresenterUtilities,
} from '../../common/presenters/student-progress-presenter';

export function useGetStudentProgressPresenter(
    setViewModel: (viewModel: viewModels.TStudentProgressViewModel) => void,
) {
    const presenterUtilities: TStudentProgressPresenterUtilities = {};
    const presenter = useMemo(
        () => new StudentProgressPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
