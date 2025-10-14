import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachCoachingSessionsPresenter, {
    TListCoachCoachingSessionsPresenterUtilities,
} from '../../common/presenters/list-coach-coaching-sessions-presenter';

export function useListCoachCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TListCoachCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TListCoachCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
