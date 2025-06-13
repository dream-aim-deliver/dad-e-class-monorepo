import { viewModels } from '@maany_shr/e-class-models';
import GetLanguagesPresenter from '../../common/presenters/get-languages-presenter';

export function createGetLanguagesPresenter(
    setViewModel: (viewModel: viewModels.TLanguageListViewModel) => void,
) {
    return new GetLanguagesPresenter(setViewModel, {});
}
