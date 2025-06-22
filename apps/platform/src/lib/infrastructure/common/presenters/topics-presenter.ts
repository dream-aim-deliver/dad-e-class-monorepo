import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TTopicsPresenterUtilities = {};

export const GetTopicsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetTopicsUseCaseResponse,
        viewModels.TTopicListViewModel,
        TTopicsPresenterUtilities
    >;

type TGetTopicsResponseMiddleware = typeof GetTopicsResponseMiddleware;

export default class TopicsPresenter extends BasePresenter<
    useCaseModels.TGetTopicsUseCaseResponse,
    viewModels.TTopicListViewModel,
    TTopicsPresenterUtilities,
    TGetTopicsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TTopicListViewModel) => void,
        viewUtilities: TTopicsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: GetTopicsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetTopicsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TTopicListViewModel {
        return {
            mode: 'default',
            data: {
                topics: response.data.topics.map((topic) => ({
                    name: topic.name,
                    url: `/offers?topics=${topic.slug}`,
                })),
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetTopicsUseCaseErrorResponse,
            TGetTopicsResponseMiddleware
        >,
    ): viewModels.TTopicListViewModel {
        return {
            mode: 'kaboom',
            data: {
                type: response.data.errorType,
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
                trace: undefined,
            },
        };
    }
}
