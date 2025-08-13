import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCoursePresenter, {
    TCreateCoursePresenterUtilities,
} from '../../common/presenters/create-course-presenter';

export function useCreateCoursePresenter(
    setViewModel: (viewModel: viewModels.TCreateCourseViewModel) => void,
) {
    const presenterUtilities: TCreateCoursePresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCoursePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
