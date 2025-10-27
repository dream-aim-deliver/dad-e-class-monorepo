import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateOutgoingTransactionPresenter, {
    TCreateOutgoingTransactionPresenterUtilities,
} from '../../common/presenters/create-outgoing-transaction-presenter';

export function useCreateOutgoingTransactionPresenter(
    setViewModel: (viewModel: viewModels.TCreateOutgoingTransactionViewModel) => void,
) {
    const presenterUtilities: TCreateOutgoingTransactionPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateOutgoingTransactionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
