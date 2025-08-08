import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SearchCoursesPresenter, {
    TCoursesPresenterUtilities,
} from '../../common/presenters/search-courses-presenter';

export function useSearchCoursesPresenter(
    setViewModel: (viewModel: viewModels.TCourseSearchViewModel) => void,
) {
    const presenterUtilities: TCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new SearchCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
