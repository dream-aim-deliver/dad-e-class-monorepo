import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListNotificationsPresenter, { TNotificationsPresenterUtilities } from '../../common/presenters/list-notifications-presenter';

export function useListNotificationsPresenter(
    setViewModel: (viewModel: viewModels.TNotificationsViewModel) => void,
) {
    const presenterUtilities: TNotificationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListNotificationsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}