import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetStudentDetailsPresenter, {
    TGetStudentDetailsPresenterUtilities,
} from '../../common/presenters/get-student-details-presenter';

export function useGetStudentDetailsPresenter(
    setViewModel: (viewModel: viewModels.TGetStudentDetailsViewModel) => void,
) {
    const presenterUtilities: TGetStudentDetailsPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetStudentDetailsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
