import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import GetEmailConfigPresenter, {
    TGetEmailConfigPresenterUtilities,
} from '../../common/presenters/get-email-config-presenter';

export function useGetEmailConfigPresenter(
    setViewModel: (viewModel: viewModels.TGetEmailConfigViewModel) => void,
) {
    const presenterUtilities: TGetEmailConfigPresenterUtilities = {};
    const presenter = useMemo(
        () => new GetEmailConfigPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
