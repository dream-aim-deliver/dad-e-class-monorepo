import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetAssignmentPresenter, {
    TGetAssignmentPresenterUtilities,
} from '../../common/presenters/assignment-presenter';

export function useGetAssignmentPresenter(
    setViewModel: (
        viewModel: viewModels.TGetAssignmentViewModel,
    ) => void,
) {
    const presenterUtilities: TGetAssignmentPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetAssignmentPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
