import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUserIncomingTransactionsPresenter, {
    TListUserIncomingTransactionsPresenterUtilities,
} from '../../common/presenters/list-user-incoming-transactions-presenter';

export function useListUserIncomingTransactionsPresenter(
    setViewModel: (viewModel: viewModels.TListUserIncomingTransactionsViewModel) => void,
) {
    const presenterUtilities: TListUserIncomingTransactionsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUserIncomingTransactionsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
