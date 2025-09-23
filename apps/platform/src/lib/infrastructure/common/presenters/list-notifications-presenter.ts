import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TNotificationsPresenterUtilities = {};

export const ListNotificationsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListNotificationsUseCaseResponse,
        viewModels.TNotificationsViewModel,
        TNotificationsPresenterUtilities
    >;

type TListNotificationsResponseMiddleware = typeof ListNotificationsResponseMiddleware;

export default class ListNotificationsPresenter extends BasePresenter<
    useCaseModels.TListNotificationsUseCaseResponse,
    viewModels.TNotificationsViewModel,
    TNotificationsPresenterUtilities,
    TListNotificationsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TNotificationsViewModel) => void,
        viewUtilities: TNotificationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListNotificationsUseCaseResponseSchema,
                viewModel: viewModels.NotificationsViewModelSchema
            },
            middleware: ListNotificationsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListNotificationsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TNotificationsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListNotificationsUseCaseErrorResponse,
            TListNotificationsResponseMiddleware
        >,
    ): viewModels.TNotificationsViewModel {
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