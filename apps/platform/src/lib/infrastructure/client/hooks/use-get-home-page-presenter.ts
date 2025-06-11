import { HomePageViewModels } from '@maany_shr/e-class-models';
import HomePageReactPresenter, {
    THomePageUtilities,
} from '../../common/presenters/get-home-page-presenter';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export function useGetHomePagePresenter(
    setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
) {
    const router = useRouter();
    const homePageUtilities: THomePageUtilities = {
        showToast: async ({ message }) => {
            // Example: Show a toast notification
            console.log('Toast:', message);
        },
        showWarning: async ({ message }) => {
            // Example: Show a warning notification
            console.warn('Warning:', message);
        },
        redirect: (page: 'login-page') => {
            // Example: Redirect to the login page
            if (page === 'login-page') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    // TODO: VIKA Use Toast and Redirect can be obtained here from a context or from next/router
    const presenter = useMemo(() => {
        return new HomePageReactPresenter(setViewModel, homePageUtilities);
    }, [setViewModel]);
    return {
        presenter,
    };
}
