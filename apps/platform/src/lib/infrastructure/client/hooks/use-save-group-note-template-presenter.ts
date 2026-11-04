import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveGroupNoteTemplatePresenter, {
    TSaveGroupNoteTemplatePresenterUtilities,
} from '../../common/presenters/save-group-note-template-presenter';

export function useSaveGroupNoteTemplatePresenter(
    setViewModel: (viewModel: viewModels.TSaveGroupNoteTemplateViewModel) => void,
) {
    const presenterUtilities: TSaveGroupNoteTemplatePresenterUtilities = {};
    const presenter = useMemo(
        () => new SaveGroupNoteTemplatePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
