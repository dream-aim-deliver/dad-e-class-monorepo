import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import TopicsPresenter, {
    TTopicsPresenterUtilities,
} from '../../common/presenters/topics-presenter';
import { useDefaultPresenterUtilities } from '../utils/use-default-presenter-utilities';

export function useListTopicsPresenter(
    setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
) {
    const presenterUtilities: TTopicsPresenterUtilities =
        useDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new TopicsPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
