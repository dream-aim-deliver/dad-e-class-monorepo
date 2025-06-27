import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useDefaultPresenterUtilities } from '../utils/use-default-presenter-utilities';
import TopicsByCategoryPresenter, {
    TTopicsByCategoryPresenterUtilities,
} from '../../common/presenters/topics-by-category-presenter';

export function useListTopicsByCategoryPresenter(
    setViewModel: (viewModel: viewModels.TTopicsByCategoryViewModel) => void,
) {
    const presenterUtilities: TTopicsByCategoryPresenterUtilities =
        useDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new TopicsByCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
