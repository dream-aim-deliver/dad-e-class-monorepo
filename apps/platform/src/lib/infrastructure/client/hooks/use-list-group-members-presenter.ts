import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListGroupMembersPresenter, {
    TListGroupMembersPresenterUtilities,
} from '../../common/presenters/list-group-members-presenter';

export function useListGroupMembersPresenter(
    setViewModel: (viewModel: viewModels.TListGroupMembersViewModel) => void,
) {
    const presenterUtilities: TListGroupMembersPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListGroupMembersPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
