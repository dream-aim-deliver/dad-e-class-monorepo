import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import ListCouponsPresenter, {
    TListCouponsPresenterUtilities,
} from '../../common/presenters/list-coupons-presenter';

export function useListCouponsPresenter(
    setViewModel: (viewModel: viewModels.TListCouponsViewModel) => void,
) {
    const presenterUtilities: TListCouponsPresenterUtilities = {};
    const presenter = useMemo(
        () => new ListCouponsPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
