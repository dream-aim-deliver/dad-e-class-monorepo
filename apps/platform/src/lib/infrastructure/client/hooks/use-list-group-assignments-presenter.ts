import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListGroupAssignmentsPresenter, {
    TListGroupAssignmentsPresenterUtilities,
} from '../../common/presenters/list-group-assignments-presenter';

export function useListGroupAssignmentsPresenter(
    setViewModel: (viewModel: viewModels.TListGroupAssignmentsViewModel) => void,
) {
    const presenterUtilities: TListGroupAssignmentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListGroupAssignmentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
