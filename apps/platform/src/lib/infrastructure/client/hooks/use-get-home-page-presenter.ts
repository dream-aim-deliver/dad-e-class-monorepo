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
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(() => {
        return new HomePageReactPresenter(setViewModel, homePageUtilities);
    }, [setViewModel]);
    return {
        presenter,
    };
}
