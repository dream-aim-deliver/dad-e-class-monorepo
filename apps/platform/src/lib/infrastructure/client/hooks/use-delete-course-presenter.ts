import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DeleteCoursePresenter, {
    TDeleteCoursePresenterUtilities,
} from '../../common/presenters/delete-course-presenter';

export function useDeleteCoursePresenter(
    setViewModel: (viewModel: viewModels.TDeleteCourseViewModel) => void,
) {
    const presenterUtilities: TDeleteCoursePresenterUtilities = {};
    const presenter = useMemo(
        () => new DeleteCoursePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
