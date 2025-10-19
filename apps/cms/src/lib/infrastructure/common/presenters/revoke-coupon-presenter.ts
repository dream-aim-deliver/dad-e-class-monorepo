import { viewModels } from '@maany_shr/e-class-models';
import {
    RevokeCouponUseCaseResponseSchema,
    TRevokeCouponUseCaseResponse,
    TRevokeCouponErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TRevokeCouponPresenterUtilities = {};

export const RevokeCouponResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TRevokeCouponUseCaseResponse,
        viewModels.TRevokeCouponViewModel,
        TRevokeCouponPresenterUtilities
    >;

type TRevokeCouponResponseMiddleware = typeof RevokeCouponResponseMiddleware;

export default class RevokeCouponPresenter extends BasePresenter<
    TRevokeCouponUseCaseResponse,
    viewModels.TRevokeCouponViewModel,
    TRevokeCouponPresenterUtilities,
    TRevokeCouponResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRevokeCouponViewModel) => void,
        viewUtilities: TRevokeCouponPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: RevokeCouponUseCaseResponseSchema,
                viewModel: viewModels.RevokeCouponViewModelSchema
            },
            middleware: RevokeCouponResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TRevokeCouponUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRevokeCouponViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TRevokeCouponErrorResponse,
            TRevokeCouponResponseMiddleware
        >,
    ): viewModels.TRevokeCouponViewModel {
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
