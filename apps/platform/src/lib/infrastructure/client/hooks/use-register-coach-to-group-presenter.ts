import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import RegisterCoachToGroupPresenter, {
    TRegisterCoachToGroupPresenterUtilities,
} from '../../common/presenters/register-coach-to-group-presenter';

export function useRegisterCoachToGroupPresenter(
    setViewModel: (viewModel: viewModels.TRegisterCoachToGroupViewModel) => void,
) {
    const presenterUtilities: TRegisterCoachToGroupPresenterUtilities = {};
    const presenter = useMemo(
        () => new RegisterCoachToGroupPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
