import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DeleteOutgoingTransactionPresenter, {
    TDeleteOutgoingTransactionPresenterUtilities,
} from '../../common/presenters/delete-outgoing-transaction-presenter';

export function useDeleteOutgoingTransactionPresenter(
    setViewModel: (viewModel: viewModels.TDeleteOutgoingTransactionViewModel) => void,
) {
    const presenterUtilities: TDeleteOutgoingTransactionPresenterUtilities = {};
    const presenter = useMemo(
        () => new DeleteOutgoingTransactionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
