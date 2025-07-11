import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AssessmentProgressPresenter, {
    TAssessmentProgressPresenterUtilities,
} from '../../common/presenters/assessment-progress-presenter';

export function useSubmitAssessmentProgressPresenter(
    setViewModel: (viewModel: viewModels.TAssessmentProgressViewModel) => void,
) {
    const presenterUtilities: TAssessmentProgressPresenterUtilities = {};
    const presenter = useMemo(
        () => new AssessmentProgressPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
