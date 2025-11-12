import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUserOutgoingTransactionsPresenter, {
    TListUserOutgoingTransactionsPresenterUtilities,
} from '../../common/presenters/list-user-outgoing-transactions-presenter';

export function useListUserOutgoingTransactionsPresenter(
    setViewModel: (viewModel: viewModels.TListUserOutgoingTransactionsViewModel) => void,
) {
    const presenterUtilities: TListUserOutgoingTransactionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUserOutgoingTransactionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
