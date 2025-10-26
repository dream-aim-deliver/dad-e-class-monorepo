import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SavePlatformFooterPresenter, {
    TSavePlatformFooterPresenterUtilities,
} from '../../common/presenters/save-platform-footer-presenter';

export function useSavePlatformFooterPresenter(
    setViewModel: (viewModel: viewModels.TSavePlatformFooterViewModel) => void,
) {
    const presenterUtilities: TSavePlatformFooterPresenterUtilities = {};
    const presenter = useMemo(
        () => new SavePlatformFooterPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
