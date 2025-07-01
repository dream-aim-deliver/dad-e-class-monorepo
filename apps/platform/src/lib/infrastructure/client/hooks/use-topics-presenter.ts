import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import TopicsPresenter, {
    TTopicsPresenterUtilities,
} from '../../common/presenters/topics-presenter';

export function useListTopicsPresenter(
    setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
) {
    const presenterUtilities: TTopicsPresenterUtilities = {};
    const presenter = useMemo(
        () => new TopicsPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
