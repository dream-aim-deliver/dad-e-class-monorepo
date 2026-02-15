import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CountUnreadNotificationsPresenter, {
    TCountUnreadNotificationsPresenterUtilities,
} from '../../common/presenters/count-unread-notifications-presenter';

export function useCountUnreadNotificationsPresenter(
    setViewModel: (viewModel: viewModels.TCountUnreadNotificationsViewModel) => void,
) {
    const presenterUtilities: TCountUnreadNotificationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new CountUnreadNotificationsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
