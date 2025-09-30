import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SavePersonalProfilePresenter, {
    TSavePersonalProfilePresenterUtilities,
} from '../../common/presenters/save-personal-profile-presenter';

export function useSavePersonalProfilePresenter(
    setViewModel: (viewModel: viewModels.TSavePersonalProfileViewModel) => void,
) {
    const presenterUtilities: TSavePersonalProfilePresenterUtilities = {};
    const presenter = useMemo(
        () => new SavePersonalProfilePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
