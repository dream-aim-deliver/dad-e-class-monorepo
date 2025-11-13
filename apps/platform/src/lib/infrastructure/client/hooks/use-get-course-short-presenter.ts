import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCourseShortPresenter, {
    TGetCourseShortPresenterUtilities,
} from '../../common/presenters/get-course-short-presenter';

export function useGetCourseShortPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseShortViewModel) => void,
) {
    const presenterUtilities: TGetCourseShortPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCourseShortPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
