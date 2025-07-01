import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TTopicsPresenterUtilities = {};

export const ListTopicsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListTopicsUseCaseResponse,
        viewModels.TTopicListViewModel,
        TTopicsPresenterUtilities
    >;

type TListTopicsResponseMiddleware = typeof ListTopicsResponseMiddleware;

export default class TopicsPresenter extends BasePresenter<
    useCaseModels.TListTopicsUseCaseResponse,
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
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: ListTopicsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListTopicsUseCaseResponse,
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
            useCaseModels.TListTopicsUseCaseErrorResponse,
            TListTopicsResponseMiddleware
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
