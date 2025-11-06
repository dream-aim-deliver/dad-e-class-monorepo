import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListLessonComponentsPresenter, {
    TListLessonComponentsPresenterUtilities,
} from '../../common/presenters/list-lesson-components-presenter';

export function useListLessonComponentsPresenter(
    setViewModel: (viewModel: viewModels.TListLessonComponentsViewModel) => void,
) {
    const presenterUtilities: TListLessonComponentsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListLessonComponentsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
