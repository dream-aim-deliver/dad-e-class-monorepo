import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetHomePagePresenter, {
    TGetHomePagePresenterUtilities,
} from '../../common/presenters/get-home-page-presenter';

/**
 * React hook for get-home-page presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useGetHomePagePresenter(
    setViewModel: (viewModel: viewModels.TGetHomePageViewModel) => void,
) {
    const presenterUtilities: TGetHomePagePresenterUtilities = {};

    // Memoize presenter to avoid recreation on every render
    const presenter = useMemo(
        () => new GetHomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );

    return { presenter };
}
