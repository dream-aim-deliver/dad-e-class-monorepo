import { viewModels } from '@maany_shr/e-class-models';
import {
    MarkNotificationsAsReadUseCaseResponseSchema,
    TMarkNotificationsAsReadUseCaseResponse,
    TMarkNotificationsAsReadErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TMarkNotificationsAsReadPresenterUtilities = {};

export const MarkNotificationsAsReadResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TMarkNotificationsAsReadUseCaseResponse,
        viewModels.TMarkNotificationsAsReadViewModel,
        TMarkNotificationsAsReadPresenterUtilities
    >;

type TMarkNotificationsAsReadResponseMiddleware = typeof MarkNotificationsAsReadResponseMiddleware;

export default class MarkNotificationsAsReadPresenter extends BasePresenter<
    TMarkNotificationsAsReadUseCaseResponse,
    viewModels.TMarkNotificationsAsReadViewModel,
    TMarkNotificationsAsReadPresenterUtilities,
    TMarkNotificationsAsReadResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TMarkNotificationsAsReadViewModel) => void,
        viewUtilities: TMarkNotificationsAsReadPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: MarkNotificationsAsReadUseCaseResponseSchema,
                viewModel: viewModels.MarkNotificationsAsReadViewModelSchema
            },
            middleware: MarkNotificationsAsReadResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TMarkNotificationsAsReadUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TMarkNotificationsAsReadViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TMarkNotificationsAsReadErrorResponse,
            TMarkNotificationsAsReadResponseMiddleware
        >,
    ): viewModels.TMarkNotificationsAsReadViewModel {
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
