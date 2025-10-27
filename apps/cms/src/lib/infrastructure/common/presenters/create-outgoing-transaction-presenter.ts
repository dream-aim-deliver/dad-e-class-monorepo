import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateOutgoingTransactionUseCaseResponseSchema,
    TCreateOutgoingTransactionUseCaseResponse,
    TCreateOutgoingTransactionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateOutgoingTransactionPresenterUtilities = {};

export const CreateOutgoingTransactionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateOutgoingTransactionUseCaseResponse,
        viewModels.TCreateOutgoingTransactionViewModel,
        TCreateOutgoingTransactionPresenterUtilities
    >;

type TCreateOutgoingTransactionResponseMiddleware = typeof CreateOutgoingTransactionResponseMiddleware;

export default class CreateOutgoingTransactionPresenter extends BasePresenter<
    TCreateOutgoingTransactionUseCaseResponse,
    viewModels.TCreateOutgoingTransactionViewModel,
    TCreateOutgoingTransactionPresenterUtilities,
    TCreateOutgoingTransactionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateOutgoingTransactionViewModel) => void,
        viewUtilities: TCreateOutgoingTransactionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateOutgoingTransactionUseCaseResponseSchema,
                viewModel: viewModels.CreateOutgoingTransactionViewModelSchema
            },
            middleware: CreateOutgoingTransactionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateOutgoingTransactionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateOutgoingTransactionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateOutgoingTransactionErrorResponse,
            TCreateOutgoingTransactionResponseMiddleware
        >,
    ): viewModels.TCreateOutgoingTransactionViewModel {
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
