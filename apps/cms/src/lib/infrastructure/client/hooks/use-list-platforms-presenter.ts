import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPlatformsPresenter, {
    TListPlatformsPresenterUtilities,
} from '../../common/presenters/list-platforms-presenter';

export function useListPlatformsPresenter(
    setViewModel: (viewModel: viewModels.TPlatformListViewModel) => void,
) {
    const presenterUtilities: TListPlatformsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPlatformsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}