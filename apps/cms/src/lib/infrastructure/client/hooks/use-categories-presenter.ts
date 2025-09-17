import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CategoriesPresenter, { TCategoriesPresenterUtilities } from '../../common/presenters/categories-presenter';

export function useListCategoriesPresenter(
    setViewModel: (viewModel: viewModels.TCategoryListViewModel) => void,
) {
    const presenterUtilities: TCategoriesPresenterUtilities = {};
    const presenter = useMemo(
        () => new CategoriesPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
