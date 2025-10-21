import { viewModels } from '@maany_shr/e-class-models';
import {
    ListTransactionsUseCaseResponseSchema,
    TListTransactionsUseCaseResponse,
    TListTransactionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListTransactionsPresenterUtilities = {};

export const ListTransactionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTransactionsUseCaseResponse,
        viewModels.TListTransactionsViewModel,
        TListTransactionsPresenterUtilities
    >;

type TListTransactionsResponseMiddleware = typeof ListTransactionsResponseMiddleware;

export default class ListTransactionsPresenter extends BasePresenter<
    TListTransactionsUseCaseResponse,
    viewModels.TListTransactionsViewModel,
    TListTransactionsPresenterUtilities,
    TListTransactionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListTransactionsViewModel) => void,
        viewUtilities: TListTransactionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListTransactionsUseCaseResponseSchema,
                viewModel: viewModels.ListTransactionsViewModelSchema
            },
            middleware: ListTransactionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListTransactionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListTransactionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListTransactionsErrorResponse,
            TListTransactionsResponseMiddleware
        >,
    ): viewModels.TListTransactionsViewModel {
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
