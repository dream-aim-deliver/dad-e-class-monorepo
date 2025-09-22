import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateNotificationPresenterUtilities = {};

export const CreateNotificationResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TCreateNotificationUseCaseResponse,
        viewModels.TCreateNotificationViewModel,
        TCreateNotificationPresenterUtilities
    >;

type TCreateNotificationResponseMiddleware =
    typeof CreateNotificationResponseMiddleware;

export default class CreateNotificationPresenter extends BasePresenter<
    useCaseModels.TCreateNotificationUseCaseResponse,
    viewModels.TCreateNotificationViewModel,
    TCreateNotificationPresenterUtilities,
    TCreateNotificationResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCreateNotificationViewModel,
        ) => void,
        viewUtilities: TCreateNotificationPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.CreateNotificationUseCaseResponseSchema,
                viewModel: viewModels.CreateNotificationViewModelSchema
            },
            middleware: CreateNotificationResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TCreateNotificationUseCaseResponse,
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
            useCaseModels.TCreateNotificationUseCaseErrorResponse,
            TCreateNotificationResponseMiddleware
        >,
    ): viewModels.TCreateNotificationViewModel {
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
