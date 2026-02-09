import { viewModels } from '@maany_shr/e-class-models';
import {
    CountUnreadNotificationsUseCaseResponseSchema,
    TCountUnreadNotificationsUseCaseResponse,
    TCountUnreadNotificationsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCountUnreadNotificationsPresenterUtilities = {};

export const CountUnreadNotificationsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCountUnreadNotificationsUseCaseResponse,
        viewModels.TCountUnreadNotificationsViewModel,
        TCountUnreadNotificationsPresenterUtilities
    >;

type TCountUnreadNotificationsResponseMiddleware = typeof CountUnreadNotificationsResponseMiddleware;

export default class CountUnreadNotificationsPresenter extends BasePresenter<
    TCountUnreadNotificationsUseCaseResponse,
    viewModels.TCountUnreadNotificationsViewModel,
    TCountUnreadNotificationsPresenterUtilities,
    TCountUnreadNotificationsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCountUnreadNotificationsViewModel) => void,
        viewUtilities: TCountUnreadNotificationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CountUnreadNotificationsUseCaseResponseSchema,
                viewModel: viewModels.CountUnreadNotificationsViewModelSchema
            },
            middleware: CountUnreadNotificationsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCountUnreadNotificationsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCountUnreadNotificationsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCountUnreadNotificationsErrorResponse,
            TCountUnreadNotificationsResponseMiddleware
        >,
    ): viewModels.TCountUnreadNotificationsViewModel {
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
