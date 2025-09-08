import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PlatformLanguagePresenter, {
    TPlatformLanguagePresenterUtilities,
} from '../../common/presenters/platform-language-presenter';

export function useGetPlatformLanguagePresenter(
    setViewModel: (
        viewModel: viewModels.TPlatformLanguageViewModel,
    ) => void,
) {
    const presenterUtilities: TPlatformLanguagePresenterUtilities = {};
    const presenter = useMemo(
        () => new PlatformLanguagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
