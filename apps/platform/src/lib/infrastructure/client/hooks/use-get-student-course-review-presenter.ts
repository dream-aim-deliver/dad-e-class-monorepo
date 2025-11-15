import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetStudentCourseReviewPresenter, {
    TGetStudentCourseReviewPresenterUtilities,
} from '../../common/presenters/get-student-course-review-presenter';

export function useGetStudentCourseReviewPresenter(
    setViewModel: (viewModel: viewModels.TGetStudentCourseReviewViewModel) => void,
) {
    const presenterUtilities: TGetStudentCourseReviewPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetStudentCourseReviewPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
