import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PlatformPresenter, {
    TPlatformPresenterUtilities,
} from '../../common/presenters/platform-presenter';

export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
) {
    const presenterUtilities: TPlatformPresenterUtilities = {};
    const presenter = useMemo(
        () => new PlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
