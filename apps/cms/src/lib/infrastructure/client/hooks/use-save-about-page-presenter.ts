import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveAboutPagePresenter, {
    TSaveAboutPagePresenterUtilities,
} from '../../common/presenters/save-about-page-presenter';

/**
 * React hook for save-about-page presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 *
 * @example
 * ```typescript
 * const [viewModel, setViewModel] = useState<viewModels.TSaveAboutPageViewModel>();
 * const { presenter } = useSaveAboutPagePresenter(setViewModel);
 *
 * // Use with controller/usecase
 * const response = await controller.execute(request, context);
 * presenter.present(response);
 *
 * // Render based on view mode
 * if (viewModel?.mode === 'default') {
 *   return <SuccessView data={viewModel.data} />;
 * }
 * if (viewModel?.mode === 'not-found') {
 *   return <NotFoundView />;
 * }
 * if (viewModel?.mode === 'kaboom') {
 *   return <ErrorView error={viewModel.data} />;
 * }
 * ```
 */
export function useSaveAboutPagePresenter(
    setViewModel: (viewModel: viewModels.TSaveAboutPageViewModel) => void,
) {
    // TODO: Add presenter utilities if needed (e.g., formatters, validators)
    const presenterUtilities: TSaveAboutPagePresenterUtilities = {};

    // Memoize presenter to avoid recreation on every render
    const presenter = useMemo(
        () => new SaveAboutPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );

    return { presenter };
}
