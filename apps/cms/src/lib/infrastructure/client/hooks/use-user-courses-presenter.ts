import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UserCoursesPresenter, {
    TUserCoursesPresenterUtilities,
} from '../../common/presenters/user-courses-presenter';

export function useListUserCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListUserCoursesViewModel) => void,
) {
    const presenterUtilities: TUserCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new UserCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
