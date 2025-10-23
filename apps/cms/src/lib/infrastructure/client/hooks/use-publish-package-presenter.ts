import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PublishPackagePresenter, {
    TPublishPackagePresenterUtilities,
} from '../../common/presenters/publish-package-presenter';

export function usePublishPackagePresenter(
    setViewModel: (viewModel: viewModels.TPublishPackageViewModel) => void,
) {
    const presenterUtilities: TPublishPackagePresenterUtilities = {};
    const presenter = useMemo(
        () => new PublishPackagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
