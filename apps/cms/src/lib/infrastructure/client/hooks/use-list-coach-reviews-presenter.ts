import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachReviewsPresenter, {
    TListCoachReviewsPresenterUtilities,
} from '../../common/presenters/list-coach-reviews-presenter';

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
