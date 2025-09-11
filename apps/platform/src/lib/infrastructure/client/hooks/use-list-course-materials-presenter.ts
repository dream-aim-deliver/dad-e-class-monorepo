import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CourseMaterialsPresenter, {
    TCourseMaterialsPresenterUtilities,
} from '../../common/presenters/course-materials-presenter';

export function useListCourseMaterialsPresenter(
    setViewModel: (
        viewModel: viewModels.TCourseMaterialsListViewModel,
    ) => void,
) {
    const presenterUtilities: TCourseMaterialsPresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new CourseMaterialsPresenter(
                setViewModel,
                presenterUtilities,
            ),
        [setViewModel],
    );
    return { presenter };
}
