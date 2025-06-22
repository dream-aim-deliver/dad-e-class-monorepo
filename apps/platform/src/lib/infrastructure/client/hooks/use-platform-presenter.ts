import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PlatformPresenter, {
    TPlatformPresenterUtilities,
} from '../../common/presenters/platform-presenter';

export function useGetPlatformPresenter(
    setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
) {
    const router = useRouter();

    const presenterUtilities: TPlatformPresenterUtilities = {
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(
        () => new PlatformPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
