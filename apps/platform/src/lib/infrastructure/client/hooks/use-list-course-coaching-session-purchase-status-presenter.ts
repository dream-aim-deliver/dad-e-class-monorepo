import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCourseCoachingSessionPurchaseStatusPresenter, {
    TListCourseCoachingSessionPurchaseStatusPresenterUtilities,
} from '../../common/presenters/list-course-coaching-session-purchase-status-presenter';

export function useListCourseCoachingSessionPurchaseStatusPresenter(
    setViewModel: (
        viewModel: viewModels.TListCourseCoachingSessionPurchaseStatusViewModel,
    ) => void,
) {
    const presenterUtilities: TListCourseCoachingSessionPurchaseStatusPresenterUtilities = {};
    const presenter = useMemo(
        () =>
            new ListCourseCoachingSessionPurchaseStatusPresenter(
                setViewModel,
                presenterUtilities,
            ),
        [setViewModel],
    );
    return { presenter };
}

