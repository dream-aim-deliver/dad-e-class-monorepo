import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import OffersPageOutlinePresenter, {
    TOffersPageOutlinePresenterUtilities,
} from '../../common/presenters/offers-page-outline-presenter';

export function useGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TOffersPageOutlineViewModel) => void,
) {
    const router = useRouter();

    const presenterUtilities: TOffersPageOutlinePresenterUtilities = {
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(
        () => new OffersPageOutlinePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
