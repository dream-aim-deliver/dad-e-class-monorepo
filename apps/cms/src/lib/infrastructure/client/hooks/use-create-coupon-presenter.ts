import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import CreateCouponPresenter, {
    TCreateCouponPresenterUtilities,
} from '../../common/presenters/create-coupon-presenter';

export function useCreateCouponPresenter(
    setViewModel: (viewModel: viewModels.TCreateCouponViewModel) => void,
) {
    const presenterUtilities: TCreateCouponPresenterUtilities = {};
    const presenter = useMemo(
        () => new CreateCouponPresenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return { presenter };
}
