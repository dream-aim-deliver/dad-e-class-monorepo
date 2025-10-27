import { viewModels } from '@maany_shr/e-class-models';
import {
    SendNotificationUseCaseResponseSchema,
    TSendNotificationUseCaseResponse,
    TSendNotificationErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSendNotificationPresenterUtilities = {};

export const SendNotificationResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSendNotificationUseCaseResponse,
        viewModels.TSendNotificationViewModel,
        TSendNotificationPresenterUtilities
    >;

type TSendNotificationResponseMiddleware = typeof SendNotificationResponseMiddleware;

export default class SendNotificationPresenter extends BasePresenter<
    TSendNotificationUseCaseResponse,
    viewModels.TSendNotificationViewModel,
    TSendNotificationPresenterUtilities,
    TSendNotificationResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSendNotificationViewModel) => void,
        viewUtilities: TSendNotificationPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SendNotificationUseCaseResponseSchema,
                viewModel: viewModels.SendNotificationViewModelSchema
            },
            middleware: SendNotificationResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSendNotificationUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSendNotificationViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSendNotificationErrorResponse,
            TSendNotificationResponseMiddleware
        >,
    ): viewModels.TSendNotificationViewModel {
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
