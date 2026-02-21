import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListTopicsByCategoryUseCaseResponse,
    ListTopicsByCategoryUseCaseResponseSchema,
    TListTopicsByCategoryErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TTopicsByCategoryPresenterUtilities = {};

export const ListTopicsByCategoryResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTopicsByCategoryUseCaseResponse,
        viewModels.TTopicsByCategoryViewModel,
        TTopicsByCategoryPresenterUtilities
    >;

type TListTopicsByCategoryResponseMiddleware =
    typeof ListTopicsByCategoryResponseMiddleware;

export default class TopicsByCategoryPresenter extends BasePresenter<
    TListTopicsByCategoryUseCaseResponse,
    viewModels.TTopicsByCategoryViewModel,
    TTopicsByCategoryPresenterUtilities,
    TListTopicsByCategoryResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TTopicsByCategoryViewModel,
        ) => void,
        viewUtilities: TTopicsByCategoryPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    ListTopicsByCategoryUseCaseResponseSchema,
                viewModel: viewModels.TopicsByCategoryViewModelSchema
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
    ): viewModels.TTopicsByCategoryViewModel {
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
    ): viewModels.TTopicsByCategoryViewModel {
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
