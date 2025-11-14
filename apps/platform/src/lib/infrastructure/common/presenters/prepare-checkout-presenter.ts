import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPrepareCheckoutPresenterUtilities = {};

export const PrepareCheckoutResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TPrepareCheckoutUseCaseResponse,
        viewModels.TPrepareCheckoutViewModel,
        TPrepareCheckoutPresenterUtilities
    >;

type TPrepareCheckoutResponseMiddleware =
    typeof PrepareCheckoutResponseMiddleware;

export default class PrepareCheckoutPresenter extends BasePresenter<
    useCaseModels.TPrepareCheckoutUseCaseResponse,
    viewModels.TPrepareCheckoutViewModel,
    TPrepareCheckoutPresenterUtilities,
    TPrepareCheckoutResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPrepareCheckoutViewModel) => void,
        viewUtilities: TPrepareCheckoutPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.PrepareCheckoutUseCaseResponseSchema,
                viewModel: viewModels.PrepareCheckoutViewModelSchema,
            },
            middleware: PrepareCheckoutResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TPrepareCheckoutUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPrepareCheckoutViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TPrepareCheckoutUseCaseErrorResponse,
            TPrepareCheckoutResponseMiddleware
        >,
    ): viewModels.TPrepareCheckoutViewModel {
        // Map error types to appropriate view modes
        const errorMessage = response.data.message;
        const context = response.data.context;

        // Check if this is a coupon-related error by examining the message or context
        if (errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('invalid')) {
            return {
                mode: 'coupon-not-found',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }

        if (errorMessage.toLowerCase().includes('expired')) {
            return {
                mode: 'coupon-expired',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }

        if (errorMessage.toLowerCase().includes('limit')) {
            return {
                mode: 'coupon-limit-reached',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }

        if (errorMessage.toLowerCase().includes('type') ||
            errorMessage.toLowerCase().includes('format')) {
            return {
                mode: 'invalid-coupon-type',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }

        // Default to kaboom for other errors
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
            },
        };
    }
}
