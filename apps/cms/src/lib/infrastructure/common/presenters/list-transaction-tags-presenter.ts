import { viewModels } from '@maany_shr/e-class-models';
import {
    ListTransactionTagsUseCaseResponseSchema,
    TListTransactionTagsUseCaseResponse,
    TListTransactionTagsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListTransactionTagsPresenterUtilities = {};

export const ListTransactionTagsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTransactionTagsUseCaseResponse,
        viewModels.TListTransactionTagsViewModel,
        TListTransactionTagsPresenterUtilities
    >;

type TListTransactionTagsResponseMiddleware = typeof ListTransactionTagsResponseMiddleware;

export default class ListTransactionTagsPresenter extends BasePresenter<
    TListTransactionTagsUseCaseResponse,
    viewModels.TListTransactionTagsViewModel,
    TListTransactionTagsPresenterUtilities,
    TListTransactionTagsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListTransactionTagsViewModel) => void,
        viewUtilities: TListTransactionTagsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListTransactionTagsUseCaseResponseSchema,
                viewModel: viewModels.ListTransactionTagsViewModelSchema
            },
            middleware: ListTransactionTagsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListTransactionTagsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListTransactionTagsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListTransactionTagsErrorResponse,
            TListTransactionTagsResponseMiddleware
        >,
    ): viewModels.TListTransactionTagsViewModel {
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
