import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AssessmentComponentsPresenter, {
    TAssessmentComponentsPresenterUtilities,
} from '../../common/presenters/assessment-components-presenter';

export function useSaveAssessmentComponentsPresenter(
    setViewModel: (
        viewModel: viewModels.TAssessmentComponentViewModel,
    ) => void,
) {
    const presenterUtilities: TAssessmentComponentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new AssessmentComponentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
