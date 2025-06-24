import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TopicsPresenter, {
    TTopicsPresenterUtilities,
} from '../../common/presenters/topics-presenter';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';

export function useListTopicsPresenter(
    setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
) {
    const presenterUtilities: TTopicsPresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new TopicsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
