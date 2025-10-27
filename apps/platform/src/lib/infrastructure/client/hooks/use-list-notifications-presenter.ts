import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListNotificationsPresenter, {
    TListNotificationsPresenterUtilities,
} from '../../common/presenters/list-notifications-presenter';

export function useListNotificationsPresenter(
    setViewModel: (viewModel: viewModels.TListNotificationsViewModel) => void,
) {
    const presenterUtilities: TListNotificationsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListNotificationsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
