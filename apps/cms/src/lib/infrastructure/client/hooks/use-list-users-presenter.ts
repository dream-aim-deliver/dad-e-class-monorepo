import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUsersPresenter, {
    TListUsersPresenterUtilities,
} from '../../common/presenters/list-users-presenter';

export function useListUsersPresenter(
    setViewModel: (viewModel: viewModels.TListUsersViewModel) => void,
) {
    const presenterUtilities: TListUsersPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUsersPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
