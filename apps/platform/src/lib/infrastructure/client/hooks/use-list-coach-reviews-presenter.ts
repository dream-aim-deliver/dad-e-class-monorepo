import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachReviewsPresenter, {
    TListCoachReviewsPresenterUtilities,
} from '../../common/presenters/list-coach-reviews-presenter';

/**
 * React hook for list-coach-reviews presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useListCoachReviewsPresenter(
    setViewModel: (viewModel: viewModels.TListCoachReviewsViewModel) => void,
) {
    const presenterUtilities: TListCoachReviewsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachReviewsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
