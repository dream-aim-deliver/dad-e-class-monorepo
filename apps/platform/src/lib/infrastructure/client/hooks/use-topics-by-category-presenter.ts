import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import TopicsByCategoryPresenter, {
    TTopicsByCategoryPresenterUtilities,
} from '../../common/presenters/topics-by-category-presenter';

export function useListTopicsByCategoryPresenter(
    setViewModel: (viewModel: viewModels.TTopicsByCategoryViewModel) => void,
) {
    const presenterUtilities: TTopicsByCategoryPresenterUtilities = {};
    const presenter = useMemo(
        () => new TopicsByCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
