import { viewModels } from '@maany_shr/e-class-models';
import {
    ListSentNotificationsUseCaseResponseSchema,
    TListSentNotificationsUseCaseResponse,
    TListSentNotificationsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListSentNotificationsPresenterUtilities = {};

export const ListSentNotificationsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListSentNotificationsUseCaseResponse,
        viewModels.TListSentNotificationsViewModel,
        TListSentNotificationsPresenterUtilities
    >;

type TListSentNotificationsResponseMiddleware = typeof ListSentNotificationsResponseMiddleware;

export default class ListSentNotificationsPresenter extends BasePresenter<
    TListSentNotificationsUseCaseResponse,
    viewModels.TListSentNotificationsViewModel,
    TListSentNotificationsPresenterUtilities,
    TListSentNotificationsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListSentNotificationsViewModel) => void,
        viewUtilities: TListSentNotificationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListSentNotificationsUseCaseResponseSchema,
                viewModel: viewModels.ListSentNotificationsViewModelSchema
            },
            middleware: ListSentNotificationsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListSentNotificationsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListSentNotificationsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListSentNotificationsErrorResponse,
            TListSentNotificationsResponseMiddleware
        >,
    ): viewModels.TListSentNotificationsViewModel {
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
