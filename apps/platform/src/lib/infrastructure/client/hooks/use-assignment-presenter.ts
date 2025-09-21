import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AssignmentPresenter, {
    TAssignmentPresenterUtilities,
} from '../../common/presenters/assignment-presenter';

export function useGetAssignmentPresenter(
    setViewModel: (
        viewModel: viewModels.TAssignmentViewModel,
    ) => void,
) {
    const presenterUtilities: TAssignmentPresenterUtilities = {};
    const presenter = useMemo(
        () => new AssignmentPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
