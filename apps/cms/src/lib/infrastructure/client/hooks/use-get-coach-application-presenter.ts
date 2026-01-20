import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCoachApplicationPresenter, {
    TGetCoachApplicationPresenterUtilities,
} from '../../common/presenters/get-coach-application-presenter';

export function useGetCoachApplicationPresenter(
    setViewModel: (viewModel: viewModels.TGetCoachApplicationViewModel) => void,
) {
    const presenterUtilities: TGetCoachApplicationPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCoachApplicationPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
