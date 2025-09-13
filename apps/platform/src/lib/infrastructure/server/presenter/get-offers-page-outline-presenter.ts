import { viewModels } from '@maany_shr/e-class-models';
import OffersPageOutlinePresenter from '../../common/presenters/offers-page-outline-presenter';

export function createGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TOffersPageOutlineViewModel) => void,
) {
    return new OffersPageOutlinePresenter(setViewModel, {});
}
