import { viewModels } from '@maany_shr/e-class-models';
import {
    ListTopicsUseCaseResponseSchema,
    TListTopicsUseCaseResponse,
    TListTopicsErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TTopicsPresenterUtilities = {};

export const ListTopicsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListTopicsUseCaseResponse,
        viewModels.TTopicListViewModel,
        TTopicsPresenterUtilities
    >;

type TListTopicsResponseMiddleware = typeof ListTopicsResponseMiddleware;

export default class TopicsPresenter extends BasePresenter<
    TListTopicsUseCaseResponse,
    viewModels.TTopicListViewModel,
    TTopicsPresenterUtilities,
    TListTopicsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
        viewUtilities: TTopicsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListTopicsUseCaseResponseSchema,
                viewModel: viewModels.TopicListViewModelSchema
            },
            middleware: ListTopicsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListTopicsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TTopicListViewModel {
        return {
            mode: 'default',
            data: {
                topics: response.data.topics.map((topic) => ({
                    id: typeof topic.id === 'string' ? parseInt(topic.id, 10) : topic.id,
                    name: topic.name,
                    slug: topic.slug,
                    url: `/offers?topics=${topic.slug}`
                }))
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListTopicsErrorResponse,
            TListTopicsResponseMiddleware
        >,
    ): viewModels.TTopicListViewModel {
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
