import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCourseReviewPresenter, {
    TCreateCourseReviewPresenterUtilities,
} from '../../common/presenters/create-course-review-presenter';

export function useCreateCourseReviewPresenter(
    setViewModel: (viewModel: viewModels.TCreateCourseReviewViewModel) => void,
) {
    const presenterUtilities: TCreateCourseReviewPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCourseReviewPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
