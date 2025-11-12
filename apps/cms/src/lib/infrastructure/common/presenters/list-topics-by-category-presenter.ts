import { viewModels } from '@maany_shr/e-class-models';
import {
    ListTopicsByCategoryUseCaseResponseSchema,
    TListTopicsByCategoryUseCaseResponse,
    TListTopicsByCategoryErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListTopicsByCategoryPresenterUtilities = {};

export const ListTopicsByCategoryResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTopicsByCategoryUseCaseResponse,
        viewModels.TListTopicsByCategoryViewModel,
        TListTopicsByCategoryPresenterUtilities
    >;

type TListTopicsByCategoryResponseMiddleware = typeof ListTopicsByCategoryResponseMiddleware;

export default class ListTopicsByCategoryPresenter extends BasePresenter<
    TListTopicsByCategoryUseCaseResponse,
    viewModels.TListTopicsByCategoryViewModel,
    TListTopicsByCategoryPresenterUtilities,
    TListTopicsByCategoryResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListTopicsByCategoryViewModel) => void,
        viewUtilities: TListTopicsByCategoryPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListTopicsByCategoryUseCaseResponseSchema,
                viewModel: viewModels.ListTopicsByCategoryViewModelSchema
            },
            middleware: ListTopicsByCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListTopicsByCategoryUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListTopicsByCategoryViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListTopicsByCategoryErrorResponse,
            TListTopicsByCategoryResponseMiddleware
        >,
    ): viewModels.TListTopicsByCategoryViewModel {
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
