import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPersonalProfilePresenter, {
    TGetPersonalProfilePresenterUtilities,
} from '../../common/presenters/get-personal-profile-presenter';

export function useGetPersonalProfilePresenter(
    setViewModel: (viewModel: viewModels.TGetPersonalProfileViewModel) => void,
) {
    const presenterUtilities: TGetPersonalProfilePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPersonalProfilePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
