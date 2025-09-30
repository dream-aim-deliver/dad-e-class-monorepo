import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetProfessionalProfilePresenter, {
    TGetProfessionalProfilePresenterUtilities,
} from '../../common/presenters/get-professional-profile-presenter';

export function useGetProfessionalProfilePresenter(
    setViewModel: (viewModel: viewModels.TGetProfessionalProfileViewModel) => void,
) {
    const presenterUtilities: TGetProfessionalProfilePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetProfessionalProfilePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
