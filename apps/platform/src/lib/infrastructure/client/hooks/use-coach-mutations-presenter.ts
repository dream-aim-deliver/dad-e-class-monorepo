import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { 
    AddCoachPresenter, 
    RemoveCoachPresenter,
    TCoachMutationsPresenterUtilities
} from '../../common/presenters/coach-mutations-presenter';

export function useAddCoachPresenter(
    setViewModel: (viewModel: viewModels.TAddCoachViewModel) => void,
) {
    const presenterUtilities: TCoachMutationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new AddCoachPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}

export function useRemoveCoachPresenter(
    setViewModel: (viewModel: viewModels.TRemoveCoachViewModel) => void,
) {
    const presenterUtilities: TCoachMutationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new RemoveCoachPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
