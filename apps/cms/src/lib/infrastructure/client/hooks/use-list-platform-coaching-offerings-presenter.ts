import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListPlatformCoachingOfferingsPresenter, {
    TListPlatformCoachingOfferingsPresenterUtilities,
} from '../../common/presenters/list-platform-coaching-offerings-presenter';

export function useListPlatformCoachingOfferingsPresenter(
    setViewModel: (viewModel: viewModels.TListPlatformCoachingOfferingsViewModel) => void,
) {
    const presenterUtilities: TListPlatformCoachingOfferingsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListPlatformCoachingOfferingsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
