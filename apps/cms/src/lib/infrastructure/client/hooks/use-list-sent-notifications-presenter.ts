import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListSentNotificationsPresenter, {
    TListSentNotificationsPresenterUtilities,
} from '../../common/presenters/list-sent-notifications-presenter';

export function useListSentNotificationsPresenter(
    setViewModel: (viewModel: viewModels.TListSentNotificationsViewModel) => void,
) {
    const presenterUtilities: TListSentNotificationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListSentNotificationsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
