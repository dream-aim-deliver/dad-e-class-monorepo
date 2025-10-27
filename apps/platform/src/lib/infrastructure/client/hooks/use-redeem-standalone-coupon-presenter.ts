import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import RedeemStandaloneCouponPresenter, {
    TRedeemStandaloneCouponPresenterUtilities,
} from '../../common/presenters/redeem-standalone-coupon-presenter';

export function useRedeemStandaloneCouponPresenter(
    setViewModel: (viewModel: viewModels.TRedeemStandaloneCouponViewModel) => void,
) {
    const presenterUtilities: TRedeemStandaloneCouponPresenterUtilities = {};
    const presenter = useMemo(
        () => new RedeemStandaloneCouponPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
