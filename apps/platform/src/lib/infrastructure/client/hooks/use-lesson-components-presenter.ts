import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import LessonComponentsPresenter, {
    TLessonComponentsPresenterUtilities,
} from '../../common/presenters/lesson-components-presenter';

export function useListLessonComponentsPresenter(
    setViewModel: (viewModel: viewModels.TLessonComponentListViewModel) => void,
) {
    const presenterUtilities: TLessonComponentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new LessonComponentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
