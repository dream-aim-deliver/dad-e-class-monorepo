import { HomePageViewModels } from '@maany_shr/e-class-models';
import HomePageReactPresenter, {
    THomePageUtilities,
} from '../../common/presenters/get-home-page-presenter';

export function getGetHomePagePresenter(
    setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
) {
    const homePageUtilities: THomePageUtilities = {};
    return new HomePageReactPresenter(setViewModel, homePageUtilities);
}
