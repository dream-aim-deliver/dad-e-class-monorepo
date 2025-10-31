import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListUserCoursesPresenter, {
    TListUserCoursesPresenterUtilities,
} from '../../common/presenters/list-user-courses-presenter';

export function useListUserCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListUserCoursesViewModel) => void,
) {
    const presenterUtilities: TListUserCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListUserCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
