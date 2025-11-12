import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListTopicsPresenter, {
    TListTopicsPresenterUtilities,
} from '../../common/presenters/list-topics-presenter';

export function useListTopicsPresenter(
    setViewModel: (viewModel: viewModels.TListTopicsViewModel) => void,
) {
    const presenterUtilities: TListTopicsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListTopicsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
