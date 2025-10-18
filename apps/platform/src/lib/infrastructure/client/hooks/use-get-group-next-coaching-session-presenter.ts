import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetGroupNextCoachingSessionPresenter, {
    TGetGroupNextCoachingSessionPresenterUtilities,
} from '../../common/presenters/get-group-next-coaching-session-presenter';

export function useGetGroupNextCoachingSessionPresenter(
    setViewModel: (viewModel: viewModels.TGetGroupNextCoachingSessionViewModel) => void,
) {
    const presenterUtilities: TGetGroupNextCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetGroupNextCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
