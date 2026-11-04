import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetPackageGroupNoteTemplatePresenter, {
    TGetPackageGroupNoteTemplatePresenterUtilities,
} from '../../common/presenters/get-package-group-note-template-presenter';

export function useGetPackageGroupNoteTemplatePresenter(
    setViewModel: (viewModel: viewModels.TGetPackageGroupNoteTemplateViewModel) => void,
) {
    const presenterUtilities: TGetPackageGroupNoteTemplatePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetPackageGroupNoteTemplatePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
