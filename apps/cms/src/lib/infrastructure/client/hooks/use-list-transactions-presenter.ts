import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListTransactionsPresenter, {
    TListTransactionsPresenterUtilities,
} from '../../common/presenters/list-transactions-presenter';

export function useListTransactionsPresenter(
    setViewModel: (viewModel: viewModels.TListTransactionsViewModel) => void,
) {
    const presenterUtilities: TListTransactionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListTransactionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
