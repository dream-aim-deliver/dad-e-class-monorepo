import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoursesPresenter, {
    TListCoursesPresenterUtilities,
} from '../../common/presenters/list-courses-presenter';

export function useListCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListCoursesViewModel) => void,
) {
    const presenterUtilities: TListCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
