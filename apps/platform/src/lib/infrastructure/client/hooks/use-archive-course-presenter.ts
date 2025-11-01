import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ArchiveCoursePresenter, {
    TArchiveCoursePresenterUtilities,
} from '../../common/presenters/archive-course-presenter';

export function useArchiveCoursePresenter(
    setViewModel: (viewModel: viewModels.TArchiveCourseViewModel) => void,
) {
    const presenterUtilities: TArchiveCoursePresenterUtilities = {};
    const presenter = useMemo(
        () => new ArchiveCoursePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
