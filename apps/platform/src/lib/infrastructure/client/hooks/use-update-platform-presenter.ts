import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdatePlatformPresenter, {
    TUpdatePlatformPresenterUtilities,
} from '../../common/presenters/update-platform-presenter';

export function useUpdatePlatformPresenter(
    setViewModel: (viewModel: viewModels.TUpdatePlatformViewModel) => void,
) {
    const presenterUtilities: TUpdatePlatformPresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdatePlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
