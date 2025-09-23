import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCoachingSessionReviewPresenter, { TCreateCoachingSessionReviewPresenterUtilities } from '../../common/presenters/create-coaching-session-review-presenter';

export function useCreateCoachingSessionReviewPresenter(
    setViewModel: (viewModel: viewModels.TCreateCoachingSessionReviewViewModel) => void,
) {
    const presenterUtilities: TCreateCoachingSessionReviewPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCoachingSessionReviewPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
