import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdateCategoryPresenter, {
    TUpdateCategoryPresenterUtilities,
} from '../../common/presenters/update-category-presenter';

export function useUpdateCategoryPresenter(
    setViewModel: (viewModel: viewModels.TUpdateCategoryViewModel) => void,
) {
    const presenterUtilities: TUpdateCategoryPresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdateCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
