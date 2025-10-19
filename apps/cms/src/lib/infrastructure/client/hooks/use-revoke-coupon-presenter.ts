import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import RevokeCouponPresenter, {
    TRevokeCouponPresenterUtilities,
} from '../../common/presenters/revoke-coupon-presenter';

export function useRevokeCouponPresenter(
    setViewModel: (viewModel: viewModels.TRevokeCouponViewModel) => void,
) {
    const presenterUtilities: TRevokeCouponPresenterUtilities = {};
    const presenter = useMemo(
        () => new RevokeCouponPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
