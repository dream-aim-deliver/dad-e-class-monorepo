import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListGroupCoachingSessionsPresenter, {
    TListGroupCoachingSessionsPresenterUtilities,
} from '../../common/presenters/list-group-coaching-sessions-presenter';

export function useListGroupCoachingSessionsPresenter(
    setViewModel: (viewModel: viewModels.TListGroupCoachingSessionsViewModel) => void,
) {
    const presenterUtilities: TListGroupCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListGroupCoachingSessionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
