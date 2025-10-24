import { viewModels } from '@maany_shr/e-class-models';
import GetOffersPageOutlinePresenter from '../../common/presenters/get-offers-page-outline-presenter';

export function createGetOffersPageOutlinePresenter(
    setViewModel: (viewModel: viewModels.TGetOffersPageOutlineViewModel) => void,
) {
    return new GetOffersPageOutlinePresenter(setViewModel, {});
}
