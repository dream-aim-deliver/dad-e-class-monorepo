import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetCourseUpcomingCoachingSessionPresenter, {
    TGetCourseUpcomingCoachingSessionPresenterUtilities,
} from '../../common/presenters/get-course-upcoming-coaching-session-presenter';

export function useGetCourseUpcomingCoachingSessionPresenter(
    setViewModel: (viewModel: viewModels.TGetCourseUpcomingCoachingSessionViewModel) => void,
) {
    const presenterUtilities: TGetCourseUpcomingCoachingSessionPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetCourseUpcomingCoachingSessionPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
