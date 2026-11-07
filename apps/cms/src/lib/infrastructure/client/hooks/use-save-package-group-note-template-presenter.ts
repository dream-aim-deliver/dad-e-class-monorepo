import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SavePackageGroupNoteTemplatePresenter, {
    TSavePackageGroupNoteTemplatePresenterUtilities,
} from '../../common/presenters/save-package-group-note-template-presenter';

export function useSavePackageGroupNoteTemplatePresenter(
    setViewModel: (viewModel: viewModels.TSavePackageGroupNoteTemplateViewModel) => void,
) {
    const presenterUtilities: TSavePackageGroupNoteTemplatePresenterUtilities = {};
    const presenter = useMemo(
        () => new SavePackageGroupNoteTemplatePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
