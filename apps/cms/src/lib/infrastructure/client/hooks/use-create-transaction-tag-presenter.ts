import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateTransactionTagPresenter, {
    TCreateTransactionTagPresenterUtilities,
} from '../../common/presenters/create-transaction-tag-presenter';

export function useCreateTransactionTagPresenter(
    setViewModel: (viewModel: viewModels.TCreateTransactionTagViewModel) => void,
) {
    const presenterUtilities: TCreateTransactionTagPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateTransactionTagPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
