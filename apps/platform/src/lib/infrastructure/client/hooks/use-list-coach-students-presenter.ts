import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCoachStudentsPresenter, {
    TListCoachStudentsPresenterUtilities,
} from '../../common/presenters/list-coach-students-presenter';

export function useListCoachStudentsPresenter(
    setViewModel: (viewModel: viewModels.TListCoachStudentsViewModel) => void,
) {
    const presenterUtilities: TListCoachStudentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCoachStudentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
