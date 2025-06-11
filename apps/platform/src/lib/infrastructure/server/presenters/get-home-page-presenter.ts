import { HomePageViewModels } from '@maany_shr/e-class-models';
import HomePageReactPresenter, {
    THomePageUtilities,
} from '../../common/presenters/get-home-page-presenter';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export function getGetHomePagePresenter(
    setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
) {
    const homePageUtilities: THomePageUtilities = {
        redirect: async (page: 'login') => {
            if (page === 'login') {
                const headersList = await headers();
                const fullUrl =
                    headersList.get('referer') || headersList.get('x-url') || '/';
                redirect(`/auth/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
            }
        },
    };
    return new HomePageReactPresenter(setViewModel, homePageUtilities);
}
