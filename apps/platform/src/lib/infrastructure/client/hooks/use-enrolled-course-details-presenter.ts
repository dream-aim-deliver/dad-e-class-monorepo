import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import EnrolledCourseDetailsPresenter, {
    TEnrolledCourseDetailsPresenterUtilities,
} from '../../common/presenters/enrolled-course-details-presenter';

export function useGetEnrolledCourseDetailsPresenter(
    setViewModel: (
        viewModel: viewModels.TEnrolledCourseDetailsViewModel,
    ) => void,
) {
    const presenterUtilities: TEnrolledCourseDetailsPresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new EnrolledCourseDetailsPresenter(
                setViewModel,
                presenterUtilities,
            ),
        [setViewModel],
    );
    return { presenter };
}
