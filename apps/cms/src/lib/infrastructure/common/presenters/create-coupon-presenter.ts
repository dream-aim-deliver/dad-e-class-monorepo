import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateCouponUseCaseResponseSchema,
    TCreateCouponUseCaseResponse,
    TCreateCouponErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCouponPresenterUtilities = {};

export const CreateCouponResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCouponUseCaseResponse,
        viewModels.TCreateCouponViewModel,
        TCreateCouponPresenterUtilities
    >;

type TCreateCouponResponseMiddleware = typeof CreateCouponResponseMiddleware;

export default class CreateCouponPresenter extends BasePresenter<
    TCreateCouponUseCaseResponse,
    viewModels.TCreateCouponViewModel,
    TCreateCouponPresenterUtilities,
    TCreateCouponResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCouponViewModel) => void,
        viewUtilities: TCreateCouponPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateCouponUseCaseResponseSchema,
                viewModel: viewModels.CreateCouponViewModelSchema
            },
            middleware: CreateCouponResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateCouponUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCouponViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCouponErrorResponse,
            TCreateCouponResponseMiddleware
        >,
    ): viewModels.TCreateCouponViewModel {
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
