import { viewModels } from '@maany_shr/e-class-models';
import {
    DeleteOutgoingTransactionUseCaseResponseSchema,
    TDeleteOutgoingTransactionUseCaseResponse,
    TDeleteOutgoingTransactionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDeleteOutgoingTransactionPresenterUtilities = {};

export const DeleteOutgoingTransactionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDeleteOutgoingTransactionUseCaseResponse,
        viewModels.TDeleteOutgoingTransactionViewModel,
        TDeleteOutgoingTransactionPresenterUtilities
    >;

type TDeleteOutgoingTransactionResponseMiddleware = typeof DeleteOutgoingTransactionResponseMiddleware;

export default class DeleteOutgoingTransactionPresenter extends BasePresenter<
    TDeleteOutgoingTransactionUseCaseResponse,
    viewModels.TDeleteOutgoingTransactionViewModel,
    TDeleteOutgoingTransactionPresenterUtilities,
    TDeleteOutgoingTransactionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDeleteOutgoingTransactionViewModel) => void,
        viewUtilities: TDeleteOutgoingTransactionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DeleteOutgoingTransactionUseCaseResponseSchema,
                viewModel: viewModels.DeleteOutgoingTransactionViewModelSchema
            },
            middleware: DeleteOutgoingTransactionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDeleteOutgoingTransactionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDeleteOutgoingTransactionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDeleteOutgoingTransactionErrorResponse,
            TDeleteOutgoingTransactionResponseMiddleware
        >,
    ): viewModels.TDeleteOutgoingTransactionViewModel {
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
