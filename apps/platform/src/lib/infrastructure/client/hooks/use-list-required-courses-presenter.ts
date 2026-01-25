import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListRequiredCoursesPresenter, {
    TListRequiredCoursesPresenterUtilities,
} from '../../common/presenters/list-required-courses-presenter';

export function useListRequiredCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListRequiredCoursesViewModel) => void,
) {
    const presenterUtilities: TListRequiredCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListRequiredCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
