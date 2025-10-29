import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListTransactionTagsPresenter, {
    TListTransactionTagsPresenterUtilities,
} from '../../common/presenters/list-transaction-tags-presenter';

export function useListTransactionTagsPresenter(
    setViewModel: (viewModel: viewModels.TListTransactionTagsViewModel) => void,
) {
    const presenterUtilities: TListTransactionTagsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListTransactionTagsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
