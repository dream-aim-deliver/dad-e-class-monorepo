import { viewModels } from '@maany_shr/e-class-models';
import {
    ListNotificationsUseCaseResponseSchema,
    TListNotificationsUseCaseResponse,
    TListNotificationsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListNotificationsPresenterUtilities = {};

export const ListNotificationsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListNotificationsUseCaseResponse,
        viewModels.TListNotificationsViewModel,
        TListNotificationsPresenterUtilities
    >;

type TListNotificationsResponseMiddleware = typeof ListNotificationsResponseMiddleware;

export default class ListNotificationsPresenter extends BasePresenter<
    TListNotificationsUseCaseResponse,
    viewModels.TListNotificationsViewModel,
    TListNotificationsPresenterUtilities,
    TListNotificationsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListNotificationsViewModel) => void,
        viewUtilities: TListNotificationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListNotificationsUseCaseResponseSchema,
                viewModel: viewModels.ListNotificationsViewModelSchema
            },
            middleware: ListNotificationsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListNotificationsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListNotificationsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListNotificationsErrorResponse,
            TListNotificationsResponseMiddleware
        >,
    ): viewModels.TListNotificationsViewModel {
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
