import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import LanguagesPresenter, {
    TLanguagesPresenterUtilities,
} from '../../common/presenters/list-languages-presenter';

export function useListLanguagesPresenter(
    setViewModel: (viewModel: viewModels.TLanguageListViewModel) => void,
) {
    const presenterUtilities: TLanguagesPresenterUtilities = {};
    const presenter = useMemo(
        () => new LanguagesPresenter(setViewModel, presenterUtilities),
        [setViewModel, presenterUtilities],
    );
    return { presenter };
}
