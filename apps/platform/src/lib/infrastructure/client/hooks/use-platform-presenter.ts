import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PlatformPresenter, {
    TPlatformPresenterUtilities,
} from '../../common/presenters/platform-presenter';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';

export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
) {
    const presenterUtilities: TPlatformPresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new PlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
