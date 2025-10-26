import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SavePlatformLanguageLegalTextsPresenter, {
    TSavePlatformLanguageLegalTextsPresenterUtilities,
} from '../../common/presenters/save-platform-language-legal-texts-presenter';

export function useSavePlatformLanguageLegalTextsPresenter(
    setViewModel: (viewModel: viewModels.TSavePlatformLanguageLegalTextsViewModel) => void,
) {
    const presenterUtilities: TSavePlatformLanguageLegalTextsPresenterUtilities = {};
    const presenter = useMemo(
        () => new SavePlatformLanguageLegalTextsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
