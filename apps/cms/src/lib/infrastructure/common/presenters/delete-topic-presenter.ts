import { viewModels } from '@maany_shr/e-class-models';
import {
    DeleteTopicUseCaseResponseSchema,
    TDeleteTopicUseCaseResponse,
    TDeleteTopicErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDeleteTopicPresenterUtilities = {};

export const DeleteTopicResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDeleteTopicUseCaseResponse,
        viewModels.TDeleteTopicViewModel,
        TDeleteTopicPresenterUtilities
    >;

type TDeleteTopicResponseMiddleware = typeof DeleteTopicResponseMiddleware;

export default class DeleteTopicPresenter extends BasePresenter<
    TDeleteTopicUseCaseResponse,
    viewModels.TDeleteTopicViewModel,
    TDeleteTopicPresenterUtilities,
    TDeleteTopicResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDeleteTopicViewModel) => void,
        viewUtilities: TDeleteTopicPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DeleteTopicUseCaseResponseSchema,
                viewModel: viewModels.DeleteTopicViewModelSchema
            },
            middleware: DeleteTopicResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDeleteTopicUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDeleteTopicViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDeleteTopicErrorResponse,
            TDeleteTopicResponseMiddleware
        >,
    ): viewModels.TDeleteTopicViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
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
