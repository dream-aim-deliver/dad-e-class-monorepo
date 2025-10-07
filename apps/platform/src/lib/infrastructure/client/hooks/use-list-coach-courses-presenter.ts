import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachCoursesPresenter, {
    TListCoachCoursesPresenterUtilities,
} from '../../common/presenters/list-coach-courses-presenter';

/**
 * React hook for list-coach-courses presenter.
 *
 * Creates and memoizes a presenter instance for transforming usecase responses
 * to view models in React components.
 *
 * @param setViewModel - Callback to update view model state
 * @returns Object containing the presenter instance
 */
export function useListCoachCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListCoachCoursesViewModel) => void,
) {
    const presenterUtilities: TListCoachCoursesPresenterUtilities = {};

    // Memoize presenter to avoid recreation on every render
    const presenter = useMemo(
        () => new ListCoachCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );

    return { presenter };
}
