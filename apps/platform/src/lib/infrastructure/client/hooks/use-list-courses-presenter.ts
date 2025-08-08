import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoursesPresenter, {
    TCoursesPresenterUtilities,
} from '../../common/presenters/list-courses-presenter';

export function useListCoursesPresenter(
    setViewModel: (viewModel: viewModels.TCourseListViewModel) => void,
) {
    const presenterUtilities: TCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
