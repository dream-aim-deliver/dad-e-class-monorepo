import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdateUserRolesPresenter, {
    TUpdateUserRolesPresenterUtilities,
} from '../../common/presenters/update-user-roles-presenter';

export function useUpdateUserRolesPresenter(
    setViewModel: (viewModel: viewModels.TUpdateUserRolesViewModel) => void,
) {
    const presenterUtilities: TUpdateUserRolesPresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdateUserRolesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
