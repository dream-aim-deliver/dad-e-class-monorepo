import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import OffersPageCarouselPresenter, {
    TOffersPageCarouselPresenterUtilities,
} from '../../common/presenters/offers-page-carousel-presenter';
import { useDefaultPresenterUtilities } from '../utils/use-default-presenter-utilities';

export function useGetOffersPageCarouselPresenter(
    setViewModel: (viewModel: viewModels.TOffersPageCarouselViewModel) => void,
) {
    const presenterUtilities: TOffersPageCarouselPresenterUtilities = {};
    const presenter = useMemo(
        () => new OffersPageCarouselPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
