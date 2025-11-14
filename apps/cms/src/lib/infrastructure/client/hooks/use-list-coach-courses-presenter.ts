import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachCoursesPresenter, {
    TListCoachCoursesPresenterUtilities,
} from '../../common/presenters/list-coach-courses-presenter';

export function useListCoachCoursesPresenter(
    setViewModel: (viewModel: viewModels.TListCoachCoursesViewModel) => void,
) {
    const presenterUtilities: TListCoachCoursesPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachCoursesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
