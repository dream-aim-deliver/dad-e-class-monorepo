import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SaveLessonNotePresenter, {
    TSaveLessonNotePresenterUtilities,
} from '../../common/presenters/save-lesson-note-presenter';

export function useSaveLessonNotePresenter(
    setViewModel: (viewModel: viewModels.TLessonNoteViewModel) => void,
) {
    const presenter = useMemo(() => {
        const presenterUtilities: TSaveLessonNotePresenterUtilities = {};
        return new SaveLessonNotePresenter(setViewModel, presenterUtilities);
    }, [setViewModel]);
    return { presenter };
}