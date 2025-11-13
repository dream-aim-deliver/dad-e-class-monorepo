import { viewModels } from '@maany_shr/e-class-models';
import {
    ListTopicsUseCaseResponseSchema,
    TListTopicsUseCaseResponse,
    TListTopicsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListTopicsPresenterUtilities = {};

export const ListTopicsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTopicsUseCaseResponse,
        viewModels.TListTopicsViewModel,
        TListTopicsPresenterUtilities
    >;

type TListTopicsResponseMiddleware = typeof ListTopicsResponseMiddleware;

export default class ListTopicsPresenter extends BasePresenter<
    TListTopicsUseCaseResponse,
    viewModels.TListTopicsViewModel,
    TListTopicsPresenterUtilities,
    TListTopicsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListTopicsViewModel) => void,
        viewUtilities: TListTopicsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListTopicsUseCaseResponseSchema,
                viewModel: viewModels.ListTopicsViewModelSchema
            },
            middleware: ListTopicsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListTopicsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListTopicsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListTopicsErrorResponse,
            TListTopicsResponseMiddleware
        >,
    ): viewModels.TListTopicsViewModel {
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
