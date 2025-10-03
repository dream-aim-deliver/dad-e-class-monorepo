import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import UpdateCoachingOfferingPresenter, {
    TUpdateCoachingOfferingPresenterUtilities,
} from '../../common/presenters/update-coaching-offering-presenter';

export function useUpdateCoachingOfferingPresenter(
    setViewModel: (viewModel: viewModels.TUpdateCoachingOfferingViewModel) => void,
) {
    const presenterUtilities: TUpdateCoachingOfferingPresenterUtilities = {};
    const presenter = useMemo(
        () => new UpdateCoachingOfferingPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
