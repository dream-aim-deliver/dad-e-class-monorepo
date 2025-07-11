import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AssessmentProgressesPresenter, {
    TAssessmentProgressesPresenterUtilities,
} from '../../common/presenters/assessment-progresses-presenter';

export function useListAssessmentProgressesPresenter(
    setViewModel: (
        viewModel: viewModels.TAssessmentProgressListViewModel,
    ) => void,
) {
    const presenterUtilities: TAssessmentProgressesPresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new AssessmentProgressesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
