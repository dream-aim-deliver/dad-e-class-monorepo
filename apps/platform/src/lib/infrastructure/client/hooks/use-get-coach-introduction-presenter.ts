import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoachIntroductionPresenter, {
    TGetCoachIntroductionPresenterUtilities,
} from '../../common/presenters/get-coach-introduction-presenter';

/**
 * React hook for get-coach-introduction presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useGetCoachIntroductionPresenter(
    setViewModel: (viewModel: viewModels.TGetCoachIntroductionViewModel) => void,
) {
    const presenterUtilities: TGetCoachIntroductionPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoachIntroductionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
