import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetGroupNoteTemplatePresenter, {
    TGetGroupNoteTemplatePresenterUtilities,
} from '../../common/presenters/get-group-note-template-presenter';

export function useGetGroupNoteTemplatePresenter(
    setViewModel: (viewModel: viewModels.TGetGroupNoteTemplateViewModel) => void,
) {
    const presenterUtilities: TGetGroupNoteTemplatePresenterUtilities = {};
    const presenter = useMemo(
        () => new GetGroupNoteTemplatePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
