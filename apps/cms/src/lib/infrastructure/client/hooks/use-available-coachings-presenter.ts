import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import AvailableCoachingsPresenter, {
    TAvailableCoachingsPresenterUtilities,
} from '../../common/presenters/available-coachings-presenter';

export function useListAvailableCoachingsPresenter(
    setViewModel: (
        viewModel: viewModels.TAvailableCoachingListViewModel,
    ) => void,
) {
    const presenterUtilities: TAvailableCoachingsPresenterUtilities = {};
    const presenter = useMemo(
        () => new AvailableCoachingsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
