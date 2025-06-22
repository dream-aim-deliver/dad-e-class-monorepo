import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GetTopicsPresenter, {
    TTopicsUtilities,
} from '../../common/presenters/get-topics-presenter';

export function useGetTopicsPresenter(
    setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
) {
    const router = useRouter();

    const topicsUtilities: TTopicsUtilities = {
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(
        () => new GetTopicsPresenter(setViewModel, topicsUtilities),
        [setViewModel],
    );
    return { presenter };
}
