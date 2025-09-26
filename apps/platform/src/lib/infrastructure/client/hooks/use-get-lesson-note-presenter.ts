import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetLessonNotePresenter, {
    TGetLessonNotePresenterUtilities,
} from '../../common/presenters/get-lesson-note-presenter';

export function useGetLessonNotePresenter(
    setViewModel: (viewModel: viewModels.TLessonNoteViewModel) => void,
) {
    const presenter = useMemo(() => {
        const presenterUtilities: TGetLessonNotePresenterUtilities = {};
        return new GetLessonNotePresenter(setViewModel, presenterUtilities);
    }, [setViewModel]);
    return { presenter };
}