import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import PublishCoursePresenter, {
    TPublishCoursePresenterUtilities,
} from '../../common/presenters/publish-course-presenter';

export function usePublishCoursePresenter(
    setViewModel: (viewModel: viewModels.TPublishCourseViewModel) => void,
) {
    const presenterUtilities: TPublishCoursePresenterUtilities = {};
    const presenter = useMemo(
        () => new PublishCoursePresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
