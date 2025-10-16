import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListGroupCoachingSessionReviewsPresenter, {
    TListGroupCoachingSessionReviewsPresenterUtilities,
} from '../../common/presenters/list-group-coaching-session-reviews-presenter';

export function useListGroupCoachingSessionReviewsPresenter(
    setViewModel: (viewModel: viewModels.TListGroupCoachingSessionReviewsViewModel) => void,
) {
    const presenterUtilities: TListGroupCoachingSessionReviewsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListGroupCoachingSessionReviewsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
