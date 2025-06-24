import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import OffersPageCarouselPresenter, {
    TOffersPageCarouselPresenterUtilities,
} from '../../common/presenters/offers-page-carousel-presenter';
import { getDefaultPresenterUtilities } from '../utils/get-default-presenter-utilities';

export function useGetOffersPageCarouselPresenter(
    setViewModel: (viewModel: viewModels.TOffersPageCarouselViewModel) => void,
) {
    const presenterUtilities: TOffersPageCarouselPresenterUtilities =
        getDefaultPresenterUtilities();
    const presenter = useMemo(
        () => new OffersPageCarouselPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
