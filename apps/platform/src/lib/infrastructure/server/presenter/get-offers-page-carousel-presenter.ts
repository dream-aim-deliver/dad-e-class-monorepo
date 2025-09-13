import { viewModels } from '@maany_shr/e-class-models';
import OffersPageCarouselPresenter from '../../common/presenters/offers-page-carousel-presenter';

export function createGetOffersPageCarouselPresenter(
    setViewModel: (viewModel: viewModels.TOffersPageCarouselViewModel) => void,
) {
    return new OffersPageCarouselPresenter(setViewModel, {});
}
