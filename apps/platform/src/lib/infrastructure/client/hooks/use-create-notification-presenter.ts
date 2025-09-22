import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateNotificationPresenter, {
    TCreateNotificationPresenterUtilities,
} from '../../common/presenters/create-notification-presenter';

export function useCreateNotificationPresenter(
    setViewModel: (viewModel: viewModels.TCreateNotificationViewModel) => void,
) {
    const presenterUtilities: TCreateNotificationPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateNotificationPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
