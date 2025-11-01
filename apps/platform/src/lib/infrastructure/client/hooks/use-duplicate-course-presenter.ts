import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DuplicateCoursePresenter, {
    TDuplicateCoursePresenterUtilities,
} from '../../common/presenters/duplicate-course-presenter';

export function useDuplicateCoursePresenter(
    setViewModel: (viewModel: viewModels.TDuplicateCourseViewModel) => void,
) {
    const presenterUtilities: TDuplicateCoursePresenterUtilities = {};
    const presenter = useMemo(
        () => new DuplicateCoursePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
