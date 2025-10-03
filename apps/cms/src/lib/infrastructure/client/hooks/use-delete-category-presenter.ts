import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DeleteCategoryPresenter, {
    TDeleteCategoryPresenterUtilities,
} from '../../common/presenters/delete-category-presenter';

export function useDeleteCategoryPresenter(
    setViewModel: (viewModel: viewModels.TDeleteCategoryViewModel) => void,
) {
    const presenterUtilities: TDeleteCategoryPresenterUtilities = {};
    const presenter = useMemo(
        () => new DeleteCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
