import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';
import {
    TGetFeedbackUseCaseResponse,
    TGetFeedbackUseCaseErrorResponse,
    GetFeedbackUseCaseResponseSchema,
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TFeedbackPresenterUtilities = {};

export const GetFeedbackResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetFeedbackUseCaseResponse,
        viewModels.TFeedbackViewModel,
        TFeedbackPresenterUtilities
    >;

type TGetFeedbackResponseMiddleware =
    typeof GetFeedbackResponseMiddleware;

export default class FeedbackPresenter extends BasePresenter<
    TGetFeedbackUseCaseResponse,
    viewModels.TFeedbackViewModel,
    TFeedbackPresenterUtilities,
    TGetFeedbackResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TFeedbackViewModel,
        ) => void,
        viewUtilities: TFeedbackPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetFeedbackUseCaseResponseSchema,
                viewModel: viewModels.FeedbackViewModelSchema,
            },
            middleware: GetFeedbackResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            TGetFeedbackUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TFeedbackViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetFeedbackUseCaseErrorResponse,
            TGetFeedbackResponseMiddleware
        >,
    ): viewModels.TFeedbackViewModel {
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
            },
        };
    }
}
