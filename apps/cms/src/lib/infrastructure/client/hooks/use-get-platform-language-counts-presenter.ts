import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPlatformLanguageCountsPresenter, {
    TGetPlatformLanguageCountsPresenterUtilities,
} from '../../common/presenters/get-platform-language-counts-presenter';

export function useGetPlatformLanguageCountsPresenter(
    setViewModel: (viewModel: viewModels.TGetPlatformLanguageCountsViewModel) => void,
) {
    const presenterUtilities: TGetPlatformLanguageCountsPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPlatformLanguageCountsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
