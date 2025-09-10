import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachStudentsPresenter, {
    TCoachStudentsPresenterUtilities,
} from '../../common/presenters/list-coach-students-presenter';

export function useListCoachStudentsPresenter(
    setViewModel: (viewModel: viewModels.TCoachStudentsViewModel) => void,
) {
    const presenterUtilities: TCoachStudentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachStudentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
