import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';
import TopicsByCategoryPresenter, {
    TTopicsByCategoryPresenterUtilities,
} from '../../common/presenters/topics-by-category-presenter';

export function useGetTopicsByCategoryPresenter(
    setViewModel: (viewModel: viewModels.TTopicsByCategoryViewModel) => void,
) {
    const presenterUtilities: TTopicsByCategoryPresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new TopicsByCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
