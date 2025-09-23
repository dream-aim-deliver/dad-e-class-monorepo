import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUpcomingCoachingSessionsPresenter, { TUpcomingCoachingSessionsPresenterUtilities } from '../../common/presenters/list-upcoming-coaching-sessions-presenter';

export function useListUpcomingCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TUpcomingCoachingSessionsListViewModel) => void,
) {
    const presenterUtilities: TUpcomingCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUpcomingCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}