import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateTopicUseCaseResponseSchema,
    TCreateTopicUseCaseResponse,
    TCreateTopicErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateTopicPresenterUtilities = {};

export const CreateTopicResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateTopicUseCaseResponse,
        viewModels.TCreateTopicViewModel,
        TCreateTopicPresenterUtilities
    >;

type TCreateTopicResponseMiddleware = typeof CreateTopicResponseMiddleware;

export default class CreateTopicPresenter extends BasePresenter<
    TCreateTopicUseCaseResponse,
    viewModels.TCreateTopicViewModel,
    TCreateTopicPresenterUtilities,
    TCreateTopicResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateTopicViewModel) => void,
        viewUtilities: TCreateTopicPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateTopicUseCaseResponseSchema,
                viewModel: viewModels.CreateTopicViewModelSchema
            },
            middleware: CreateTopicResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateTopicUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateTopicViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateTopicErrorResponse,
            TCreateTopicResponseMiddleware
        >,
    ): viewModels.TCreateTopicViewModel {
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
