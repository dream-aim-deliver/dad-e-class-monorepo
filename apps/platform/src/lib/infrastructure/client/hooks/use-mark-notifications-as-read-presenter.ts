import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import MarkNotificationsAsReadPresenter, {
    TMarkNotificationsAsReadPresenterUtilities,
} from '../../common/presenters/mark-notifications-as-read-presenter';

export function useMarkNotificationsAsReadPresenter(
    setViewModel: (viewModel: viewModels.TMarkNotificationsAsReadViewModel) => void,
) {
    const presenterUtilities: TMarkNotificationsAsReadPresenterUtilities = {};
    const presenter = useMemo(
        () => new MarkNotificationsAsReadPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
