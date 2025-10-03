import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateTopicPresenter, {
    TCreateTopicPresenterUtilities,
} from '../../common/presenters/create-topic-presenter';

export function useCreateTopicPresenter(
    setViewModel: (viewModel: viewModels.TCreateTopicViewModel) => void,
) {
    const presenterUtilities: TCreateTopicPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateTopicPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
