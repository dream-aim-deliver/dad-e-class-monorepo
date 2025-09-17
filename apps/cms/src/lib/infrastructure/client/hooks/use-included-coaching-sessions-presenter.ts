import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import IncludedCoachingSessionsPresenter, {
    TIncludedCoachingSessionsPresenterUtilities,
} from '../../common/presenters/included-coaching-sessions-presenter';

export function useListIncludedCoachingSessionsPresenter(
    setViewModel: (
        viewModel: viewModels.TIncludedCoachingSessionListViewModel,
    ) => void,
) {
    const presenterUtilities: TIncludedCoachingSessionsPresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new IncludedCoachingSessionsPresenter(
                setViewModel,
                presenterUtilities,
            ),
        [setViewModel],
    );
    return { presenter };
}
