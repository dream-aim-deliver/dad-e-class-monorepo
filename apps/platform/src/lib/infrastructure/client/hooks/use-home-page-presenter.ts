import HomePagePresenter, {
    THomePagePresenterUtilities,
} from '../../common/presenters/home-page-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export function useGetHomePagePresenter(
    setViewModel: (viewModel: viewModels.THomePageViewModel) => void,
) {
    const router = useRouter();

    const presenterUtilities: THomePagePresenterUtilities = {
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(
        () => new HomePagePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
