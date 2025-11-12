import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateNotificationUseCaseResponseSchema,
    TCreateNotificationUseCaseResponse,
    TCreateNotificationErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateNotificationPresenterUtilities = {};

export const CreateNotificationResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateNotificationUseCaseResponse,
        viewModels.TCreateNotificationViewModel,
        TCreateNotificationPresenterUtilities
    >;

type TCreateNotificationResponseMiddleware = typeof CreateNotificationResponseMiddleware;

export default class CreateNotificationPresenter extends BasePresenter<
    TCreateNotificationUseCaseResponse,
    viewModels.TCreateNotificationViewModel,
    TCreateNotificationPresenterUtilities,
    TCreateNotificationResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateNotificationViewModel) => void,
        viewUtilities: TCreateNotificationPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateNotificationUseCaseResponseSchema,
                viewModel: viewModels.CreateNotificationViewModelSchema
            },
            middleware: CreateNotificationResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateNotificationUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateNotificationViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateNotificationErrorResponse,
            TCreateNotificationResponseMiddleware
        >,
    ): viewModels.TCreateNotificationViewModel {
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
