import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import DeleteCoachingOfferingPresenter, {
    TDeleteCoachingOfferingPresenterUtilities,
} from '../../common/presenters/delete-coaching-offering-presenter';

export function useDeleteCoachingOfferingPresenter(
    setViewModel: (viewModel: viewModels.TDeleteCoachingOfferingViewModel) => void,
) {
    const presenterUtilities: TDeleteCoachingOfferingPresenterUtilities = {};
    const presenter = useMemo(
        () => new DeleteCoachingOfferingPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
