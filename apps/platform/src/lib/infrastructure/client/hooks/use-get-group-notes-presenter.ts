import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetGroupNotesPresenter, {
    TGetGroupNotesPresenterUtilities,
} from '../../common/presenters/get-group-notes-presenter';

export function useGetGroupNotesPresenter(
    setViewModel: (viewModel: viewModels.TGetGroupNotesViewModel) => void,
) {
    const presenterUtilities: TGetGroupNotesPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetGroupNotesPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
