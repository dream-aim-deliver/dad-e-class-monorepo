import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUserIncomingTransactionsUseCaseResponseSchema,
    TListUserIncomingTransactionsUseCaseResponse,
    TListUserIncomingTransactionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUserIncomingTransactionsPresenterUtilities = {};

export const ListUserIncomingTransactionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUserIncomingTransactionsUseCaseResponse,
        viewModels.TListUserIncomingTransactionsViewModel,
        TListUserIncomingTransactionsPresenterUtilities
    >;

type TListUserIncomingTransactionsResponseMiddleware = typeof ListUserIncomingTransactionsResponseMiddleware;

export default class ListUserIncomingTransactionsPresenter extends BasePresenter<
    TListUserIncomingTransactionsUseCaseResponse,
    viewModels.TListUserIncomingTransactionsViewModel,
    TListUserIncomingTransactionsPresenterUtilities,
    TListUserIncomingTransactionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUserIncomingTransactionsViewModel) => void,
        viewUtilities: TListUserIncomingTransactionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUserIncomingTransactionsUseCaseResponseSchema,
                viewModel: viewModels.ListUserIncomingTransactionsViewModelSchema
            },
            middleware: ListUserIncomingTransactionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUserIncomingTransactionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUserIncomingTransactionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUserIncomingTransactionsErrorResponse,
            TListUserIncomingTransactionsResponseMiddleware
        >,
    ): viewModels.TListUserIncomingTransactionsViewModel {
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
