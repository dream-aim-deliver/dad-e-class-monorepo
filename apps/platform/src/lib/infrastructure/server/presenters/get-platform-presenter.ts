import { viewModels } from '@maany_shr/e-class-models';
import { THomePageUtilities } from '../../common/presenters/get-home-page-presenter';
import PlatformReactPresenter from '../../common/presenters/get-platform-presenter';

export function getPlatformPresenter(
    setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
) {
    const platformUtilities: THomePageUtilities = {};
    return new PlatformReactPresenter(setViewModel, platformUtilities);
}
