import { viewModels } from '@maany_shr/e-class-models';
import {
    RedeemStandaloneCouponUseCaseResponseSchema,
    TRedeemStandaloneCouponUseCaseResponse,
    TRedeemStandaloneCouponErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TRedeemStandaloneCouponPresenterUtilities = {};

export const RedeemStandaloneCouponResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TRedeemStandaloneCouponUseCaseResponse,
        viewModels.TRedeemStandaloneCouponViewModel,
        TRedeemStandaloneCouponPresenterUtilities
    >;

type TRedeemStandaloneCouponResponseMiddleware = typeof RedeemStandaloneCouponResponseMiddleware;

export default class RedeemStandaloneCouponPresenter extends BasePresenter<
    TRedeemStandaloneCouponUseCaseResponse,
    viewModels.TRedeemStandaloneCouponViewModel,
    TRedeemStandaloneCouponPresenterUtilities,
    TRedeemStandaloneCouponResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRedeemStandaloneCouponViewModel) => void,
        viewUtilities: TRedeemStandaloneCouponPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: RedeemStandaloneCouponUseCaseResponseSchema,
                viewModel: viewModels.RedeemStandaloneCouponViewModelSchema
            },
            middleware: RedeemStandaloneCouponResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TRedeemStandaloneCouponUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRedeemStandaloneCouponViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TRedeemStandaloneCouponErrorResponse,
            TRedeemStandaloneCouponResponseMiddleware
        >,
    ): viewModels.TRedeemStandaloneCouponViewModel {
        if (response.data.errorType === 'NotFoundError') {
            return {
                mode: 'not-found',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }
            };
        }
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context
            }
        };
    }
}
