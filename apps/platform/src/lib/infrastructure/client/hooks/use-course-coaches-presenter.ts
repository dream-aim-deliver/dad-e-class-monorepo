import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseCoachesPresenter, {
    TCourseCoachesPresenterUtilities,
} from '../../common/presenters/course-coaches-presenter';

export function useListCourseCoachesPresenter(
    setViewModel: (viewModel: viewModels.TCoachListViewModel) => void,
) {
    const presenterUtilities: TCourseCoachesPresenterUtilities = {};
    const presenter = useMemo(
        () => new CourseCoachesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
