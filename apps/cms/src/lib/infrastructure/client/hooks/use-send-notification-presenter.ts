import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import SendNotificationPresenter, {
    TSendNotificationPresenterUtilities,
} from '../../common/presenters/send-notification-presenter';

export function useSendNotificationPresenter(
    setViewModel: (viewModel: viewModels.TSendNotificationViewModel) => void,
) {
    const presenterUtilities: TSendNotificationPresenterUtilities = {};
    const presenter = useMemo(
        () => new SendNotificationPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
