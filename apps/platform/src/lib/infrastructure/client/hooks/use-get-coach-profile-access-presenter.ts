import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoachProfileAccessPresenter, {
    TGetCoachProfileAccessPresenterUtilities,
} from '../../common/presenters/get-coach-profile-access-presenter';

/**
 * React hook for get-coach-profile-access presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useGetCoachProfileAccessPresenter(
    setViewModel: (viewModel: viewModels.TGetCoachProfileAccessViewModel) => void,
) {
    const presenterUtilities: TGetCoachProfileAccessPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoachProfileAccessPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
