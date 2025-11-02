import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPlatformPresenter, {
    TGetPlatformPresenterUtilities,
} from '../../common/presenters/get-platform-presenter';

/**
 * React hook for get-platform presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TGetPlatformViewModel) => void,
) {
    const presenterUtilities: TGetPlatformPresenterUtilities = {};

    // Memoize presenter to avoid recreation on every render
    const presenter = useMemo(
        () => new GetPlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );

    return { presenter };
}
