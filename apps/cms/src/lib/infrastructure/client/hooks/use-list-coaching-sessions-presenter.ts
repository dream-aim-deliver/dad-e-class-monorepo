import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachingSessionsPresenter, {
    TListCoachingSessionsPresenterUtilities,
} from '../../common/presenters/list-coaching-sessions-presenter';

export function useListCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TListCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TListCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
