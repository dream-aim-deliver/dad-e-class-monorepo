import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateGroupCoachingSessionPresenter, {
    TCreateGroupCoachingSessionPresenterUtilities,
} from '../../common/presenters/create-group-coaching-session-presenter';

export function useCreateGroupCoachingSessionPresenter(
    setViewModel: (viewModel: viewModels.TCreateGroupCoachingSessionViewModel) => void,
) {
    const presenterUtilities: TCreateGroupCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateGroupCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
