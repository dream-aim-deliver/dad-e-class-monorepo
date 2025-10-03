import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCoachingOfferingPresenter, {
    TCreateCoachingOfferingPresenterUtilities,
} from '../../common/presenters/create-coaching-offering-presenter';

export function useCreateCoachingOfferingPresenter(
    setViewModel: (viewModel: viewModels.TCreateCoachingOfferingViewModel) => void,
) {
    const presenterUtilities: TCreateCoachingOfferingPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCoachingOfferingPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
