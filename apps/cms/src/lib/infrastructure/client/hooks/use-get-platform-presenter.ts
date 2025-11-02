import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPlatformPresenter, {
    TGetPlatformPresenterUtilities,
} from '../../common/presenters/get-platform-presenter';

export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TGetPlatformViewModel) => void,
) {
    const presenterUtilities: TGetPlatformPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
