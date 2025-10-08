import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveHomePagePresenter, {
    TSaveHomePagePresenterUtilities,
} from '../../common/presenters/save-home-page-presenter';

/**
 * React hook for save-home-page presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useSaveHomePagePresenter(
    setViewModel: (viewModel: viewModels.TSaveHomePageViewModel) => void,
) {
    const presenterUtilities: TSaveHomePagePresenterUtilities = {};

    // Memoize presenter to avoid recreation on every render
    const presenter = useMemo(
        () => new SaveHomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );

    return { presenter };
}
