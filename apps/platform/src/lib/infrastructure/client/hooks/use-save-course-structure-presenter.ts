import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveCourseStructurePresenter, {
    TCourseStructurePresenterUtilities,
} from '../../common/presenters/save-course-structure-presenter';

export function useSaveCourseStructurePresenter(
    setViewModel: (viewModel: viewModels.TSaveCourseStructureViewModel) => void,
) {
    const presenterUtilities: TCourseStructurePresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new SaveCourseStructurePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
