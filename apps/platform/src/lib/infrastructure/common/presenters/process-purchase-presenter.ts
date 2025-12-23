import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TProcessPurchasePresenterUtilities = {};

export const ProcessPurchaseResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TProcessPurchaseUseCaseResponse,
        viewModels.TProcessPurchaseViewModel,
        TProcessPurchasePresenterUtilities
    >;

type TProcessPurchaseResponseMiddleware =
    typeof ProcessPurchaseResponseMiddleware;

export default class ProcessPurchasePresenter extends BasePresenter<
    useCaseModels.TProcessPurchaseUseCaseResponse,
    viewModels.TProcessPurchaseViewModel,
    TProcessPurchasePresenterUtilities,
    TProcessPurchaseResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TProcessPurchaseViewModel) => void,
        viewUtilities: TProcessPurchasePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ProcessPurchaseUseCaseResponseSchema,
                viewModel: viewModels.ProcessPurchaseViewModelSchema,
            },
            middleware: ProcessPurchaseResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TProcessPurchaseUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TProcessPurchaseViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TProcessPurchaseErrorResponse,
            TProcessPurchaseResponseMiddleware
        >,
    ): viewModels.TProcessPurchaseViewModel {
        // Map error types to appropriate view modes
        if (response.data.errorType === 'payment_not_completed') {
            return {
                mode: 'payment-not-completed',
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

