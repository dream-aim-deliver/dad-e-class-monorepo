import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdateTopicPresenter, {
    TUpdateTopicPresenterUtilities,
} from '../../common/presenters/update-topic-presenter';

export function useUpdateTopicPresenter(
    setViewModel: (viewModel: viewModels.TUpdateTopicViewModel) => void,
) {
    const presenterUtilities: TUpdateTopicPresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdateTopicPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
