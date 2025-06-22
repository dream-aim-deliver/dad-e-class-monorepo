import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TopicsPresenter, {
    TTopicsPresenterUtilities,
} from '../../common/presenters/topics-presenter';

export function useGetTopicsPresenter(
    setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
) {
    const router = useRouter();

    const topicsUtilities: TTopicsPresenterUtilities = {
        redirect: (page: 'login') => {
            if (page === 'login') {
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                );
            }
        },
    };
    const presenter = useMemo(
        () => new TopicsPresenter(setViewModel, topicsUtilities),
        [setViewModel],
    );
    return { presenter };
}
