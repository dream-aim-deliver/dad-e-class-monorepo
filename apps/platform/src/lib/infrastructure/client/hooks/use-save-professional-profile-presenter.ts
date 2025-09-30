import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveProfessionalProfilePresenter, {
    TSaveProfessionalProfilePresenterUtilities,
} from '../../common/presenters/save-professional-profile-presenter';

export function useSaveProfessionalProfilePresenter(
    setViewModel: (viewModel: viewModels.TSaveProfessionalProfileViewModel) => void,
) {
    const presenterUtilities: TSaveProfessionalProfilePresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveProfessionalProfilePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
