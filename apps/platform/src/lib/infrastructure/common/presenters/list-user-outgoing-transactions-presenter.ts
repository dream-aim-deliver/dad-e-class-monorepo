import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUserOutgoingTransactionsUseCaseResponseSchema,
    TListUserOutgoingTransactionsUseCaseResponse,
    TListUserOutgoingTransactionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUserOutgoingTransactionsPresenterUtilities = {};

export const ListUserOutgoingTransactionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUserOutgoingTransactionsUseCaseResponse,
        viewModels.TListUserOutgoingTransactionsViewModel,
        TListUserOutgoingTransactionsPresenterUtilities
    >;

type TListUserOutgoingTransactionsResponseMiddleware = typeof ListUserOutgoingTransactionsResponseMiddleware;

export default class ListUserOutgoingTransactionsPresenter extends BasePresenter<
    TListUserOutgoingTransactionsUseCaseResponse,
    viewModels.TListUserOutgoingTransactionsViewModel,
    TListUserOutgoingTransactionsPresenterUtilities,
    TListUserOutgoingTransactionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUserOutgoingTransactionsViewModel) => void,
        viewUtilities: TListUserOutgoingTransactionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUserOutgoingTransactionsUseCaseResponseSchema,
                viewModel: viewModels.ListUserOutgoingTransactionsViewModelSchema
            },
            middleware: ListUserOutgoingTransactionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUserOutgoingTransactionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUserOutgoingTransactionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUserOutgoingTransactionsErrorResponse,
            TListUserOutgoingTransactionsResponseMiddleware
        >,
    ): viewModels.TListUserOutgoingTransactionsViewModel {
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
