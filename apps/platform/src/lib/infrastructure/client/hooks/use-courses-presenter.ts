import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CoursesPresenter, {
    TCoursesPresenterUtilities,
} from '../../common/presenters/courses-presenter';

export function useGetCoursesPresenter(
    setViewModel: (viewModel: viewModels.TCourseListViewModel) => void,
) {
    const presenterUtilities: TCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new CoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
