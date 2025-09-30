import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListStudentInteractionsUseCaseResponse,
    ListStudentInteractionsUseCaseResponseSchema,
    TListStudentInteractionsErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListStudentInteractionsPresenterUtilities = {};

export const ListStudentInteractionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListStudentInteractionsUseCaseResponse,
        viewModels.TListStudentInteractionsViewModel,
        TListStudentInteractionsPresenterUtilities
    >;

type TListStudentInteractionsResponseMiddleware = typeof ListStudentInteractionsResponseMiddleware;

export default class ListStudentInteractionsPresenter extends BasePresenter<
    TListStudentInteractionsUseCaseResponse,
    viewModels.TListStudentInteractionsViewModel,
    TListStudentInteractionsPresenterUtilities,
    TListStudentInteractionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListStudentInteractionsViewModel) => void,
        viewUtilities: TListStudentInteractionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListStudentInteractionsUseCaseResponseSchema,
                viewModel: viewModels.ListStudentInteractionsViewModelSchema
            },
            middleware: ListStudentInteractionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListStudentInteractionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListStudentInteractionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListStudentInteractionsErrorResponse,
            TListStudentInteractionsResponseMiddleware
        >,
    ): viewModels.TListStudentInteractionsViewModel {
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