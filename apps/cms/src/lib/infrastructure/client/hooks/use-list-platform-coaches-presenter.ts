import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPlatformCoachesPresenter, {
    TListPlatformCoachesPresenterUtilities,
} from '../../common/presenters/list-platform-coaches-presenter';

export function useListPlatformCoachesPresenter(
    setViewModel: (viewModel: viewModels.TListPlatformCoachesViewModel) => void,
) {
    const presenterUtilities: TListPlatformCoachesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPlatformCoachesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
