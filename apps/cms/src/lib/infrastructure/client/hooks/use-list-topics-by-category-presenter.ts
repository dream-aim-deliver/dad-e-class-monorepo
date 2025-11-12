import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListTopicsByCategoryPresenter, {
    TListTopicsByCategoryPresenterUtilities,
} from '../../common/presenters/list-topics-by-category-presenter';

export function useListTopicsByCategoryPresenter(
    setViewModel: (viewModel: viewModels.TListTopicsByCategoryViewModel) => void,
) {
    const presenterUtilities: TListTopicsByCategoryPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListTopicsByCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
