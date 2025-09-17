import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import LessonComponentsPresenter, {
    TLessonComponentsPresenterUtilities,
} from '../../common/presenters/save-lesson-components-presenter';

export function useSaveLessonComponentsPresenter(
    setViewModel: (
        viewModel: viewModels.TSaveLessonComponentsViewModel,
    ) => void,
) {
    const presenterUtilities: TLessonComponentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new LessonComponentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
