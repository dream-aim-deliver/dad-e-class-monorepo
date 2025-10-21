import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveCoachingPagePresenter, {
    TSaveCoachingPagePresenterUtilities,
} from '../../common/presenters/save-coaching-page-presenter';

export function useSaveCoachingPagePresenter(
    setViewModel: (viewModel: viewModels.TSaveCoachingPageViewModel) => void,
) {
    const presenterUtilities: TSaveCoachingPagePresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveCoachingPagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
