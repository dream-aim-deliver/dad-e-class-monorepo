import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCmsCoursesPresenter, {
    TListCmsCoursesPresenterUtilities,
} from '../../common/presenters/list-cms-courses-presenter';

export function useListCmsCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListCmsCoursesViewModel) => void,
) {
    const presenterUtilities: TListCmsCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCmsCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
