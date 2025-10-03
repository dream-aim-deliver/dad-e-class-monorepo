import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DeleteTopicPresenter, {
    TDeleteTopicPresenterUtilities,
} from '../../common/presenters/delete-topic-presenter';

export function useDeleteTopicPresenter(
    setViewModel: (viewModel: viewModels.TDeleteTopicViewModel) => void,
) {
    const presenterUtilities: TDeleteTopicPresenterUtilities = {};
    const presenter = useMemo(
        () => new DeleteTopicPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
