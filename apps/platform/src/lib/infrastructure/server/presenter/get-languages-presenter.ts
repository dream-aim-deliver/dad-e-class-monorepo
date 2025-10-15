import { viewModels } from '@maany_shr/e-class-models';
import LanguagesPresenter from '../../common/presenters/list-languages-presenter';

export function createGetLanguagesPresenter(
    setViewModel: (viewModel: viewModels.TLanguageListViewModel) => void,
) {
    return new LanguagesPresenter(setViewModel, {});
}
