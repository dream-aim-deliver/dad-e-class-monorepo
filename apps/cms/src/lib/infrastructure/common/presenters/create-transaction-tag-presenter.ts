import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateTransactionTagUseCaseResponseSchema,
    TCreateTransactionTagUseCaseResponse,
    TCreateTransactionTagErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateTransactionTagPresenterUtilities = {};

export const CreateTransactionTagResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateTransactionTagUseCaseResponse,
        viewModels.TCreateTransactionTagViewModel,
        TCreateTransactionTagPresenterUtilities
    >;

type TCreateTransactionTagResponseMiddleware = typeof CreateTransactionTagResponseMiddleware;

export default class CreateTransactionTagPresenter extends BasePresenter<
    TCreateTransactionTagUseCaseResponse,
    viewModels.TCreateTransactionTagViewModel,
    TCreateTransactionTagPresenterUtilities,
    TCreateTransactionTagResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateTransactionTagViewModel) => void,
        viewUtilities: TCreateTransactionTagPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateTransactionTagUseCaseResponseSchema,
                viewModel: viewModels.CreateTransactionTagViewModelSchema
            },
            middleware: CreateTransactionTagResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateTransactionTagUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateTransactionTagViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateTransactionTagErrorResponse,
            TCreateTransactionTagResponseMiddleware
        >,
    ): viewModels.TCreateTransactionTagViewModel {
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
