import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdateTopicUseCaseResponseSchema,
    TUpdateTopicUseCaseResponse,
    TUpdateTopicErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdateTopicPresenterUtilities = {};

export const UpdateTopicResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdateTopicUseCaseResponse,
        viewModels.TUpdateTopicViewModel,
        TUpdateTopicPresenterUtilities
    >;

type TUpdateTopicResponseMiddleware = typeof UpdateTopicResponseMiddleware;

export default class UpdateTopicPresenter extends BasePresenter<
    TUpdateTopicUseCaseResponse,
    viewModels.TUpdateTopicViewModel,
    TUpdateTopicPresenterUtilities,
    TUpdateTopicResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdateTopicViewModel) => void,
        viewUtilities: TUpdateTopicPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdateTopicUseCaseResponseSchema,
                viewModel: viewModels.UpdateTopicViewModelSchema
            },
            middleware: UpdateTopicResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdateTopicUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdateTopicViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdateTopicErrorResponse,
            TUpdateTopicResponseMiddleware
        >,
    ): viewModels.TUpdateTopicViewModel {
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
