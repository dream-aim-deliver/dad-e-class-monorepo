import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveGroupNotesPresenter, {
    TSaveGroupNotesPresenterUtilities,
} from '../../common/presenters/save-group-notes-presenter';

export function useSaveGroupNotesPresenter(
    setViewModel: (viewModel: viewModels.TSaveGroupNotesViewModel) => void,
) {
    const presenterUtilities: TSaveGroupNotesPresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveGroupNotesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
