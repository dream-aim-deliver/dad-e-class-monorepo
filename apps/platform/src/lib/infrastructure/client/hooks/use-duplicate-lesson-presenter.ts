import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DuplicateLessonPresenter, {
    TDuplicateLessonPresenterUtilities,
} from '../../common/presenters/duplicate-lesson-presenter';

export function useDuplicateLessonPresenter(
    setViewModel: (viewModel: viewModels.TDuplicateLessonViewModel) => void,
) {
    const presenterUtilities: TDuplicateLessonPresenterUtilities = {};
    const presenter = useMemo(
        () => new DuplicateLessonPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
