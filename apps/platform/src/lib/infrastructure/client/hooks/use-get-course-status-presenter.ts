import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCourseStatusPresenter, {
    TGetCourseStatusPresenterUtilities,
} from '../../common/presenters/get-course-status-presenter';

export function useGetCourseStatusPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseStatusViewModel) => void,
) {
    const presenterUtilities: TGetCourseStatusPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCourseStatusPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
