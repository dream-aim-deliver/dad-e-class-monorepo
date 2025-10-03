import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCategoryPresenter, {
    TCreateCategoryPresenterUtilities,
} from '../../common/presenters/create-category-presenter';

export function useCreateCategoryPresenter(
    setViewModel: (viewModel: viewModels.TCreateCategoryViewModel) => void,
) {
    const presenterUtilities: TCreateCategoryPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCategoryPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
