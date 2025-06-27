import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PlatformPresenter, {
    TPlatformPresenterUtilities,
} from '../../common/presenters/platform-presenter';
import { useDefaultPresenterUtilities } from '../utils/use-default-presenter-utilities';

export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
) {
    const presenterUtilities: TPlatformPresenterUtilities =
        useDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new PlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
