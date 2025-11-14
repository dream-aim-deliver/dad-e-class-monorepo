import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUserRolesPresenter, {
    TListUserRolesPresenterUtilities,
} from '../../common/presenters/list-user-roles-presenter';

export function useListUserRolesPresenter(
    setViewModel: (viewModel: viewModels.TListUserRolesViewModel) => void,
) {
    const presenterUtilities: TListUserRolesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUserRolesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
