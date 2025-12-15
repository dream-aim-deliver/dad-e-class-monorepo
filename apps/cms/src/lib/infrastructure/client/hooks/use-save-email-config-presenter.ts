import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveEmailConfigPresenter, {
    TSaveEmailConfigPresenterUtilities,
} from '../../common/presenters/save-email-config-presenter';

export function useSaveEmailConfigPresenter(
    setViewModel: (viewModel: viewModels.TSaveEmailConfigViewModel) => void,
) {
    const presenterUtilities: TSaveEmailConfigPresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveEmailConfigPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
