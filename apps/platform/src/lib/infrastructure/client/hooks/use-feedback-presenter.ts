import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import FeedbackPresenter, {
    TFeedbackPresenterUtilities,
} from '../../common/presenters/feedback-presenter';

export function useGetFeedbackPresenter(
    setViewModel: (
        viewModel: viewModels.TFeedbackViewModel,
    ) => void,
) {
    const presenterUtilities: TFeedbackPresenterUtilities = {};
    const presenter = useMemo(
        () => new FeedbackPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
