import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TTopicsByCategoryPresenterUtilities = {
    redirect: (page: 'login') => Promise<void> | void;
};

export const GetTopicsByCategoryResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: ExtractStatusModel<
                    useCaseModels.TGetTopicsByCategoryUseCaseResponse,
                    false
                >;
                currentViewModel: viewModels.TTopicsByCategoryViewModel;
                setViewModel: (
                    currentViewModel: viewModels.TTopicsByCategoryViewModel,
                    viewModel: viewModels.TTopicsByCategoryViewModel,
                ) => void;
            },
            callback: TTopicsByCategoryPresenterUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies TBaseResponseResponseMiddleware<
    useCaseModels.TGetTopicsByCategoryUseCaseResponse,
    viewModels.TTopicsByCategoryViewModel,
    TTopicsByCategoryPresenterUtilities
>;

type TGetTopicsByCategoryResponseMiddleware =
    typeof GetTopicsByCategoryResponseMiddleware;

export default class TopicsByCategoryPresenter extends BasePresenter<
    useCaseModels.TGetTopicsByCategoryUseCaseResponse,
    viewModels.TTopicsByCategoryViewModel,
    TTopicsByCategoryPresenterUtilities,
    TGetTopicsByCategoryResponseMiddleware
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
                    useCaseModels.GetTopicsByCategoryUseCaseResponseSchema,
                viewModel: viewModels.TopicsByCategoryViewModelSchema,
            },
            middleware: GetTopicsByCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetTopicsByCategoryUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TTopicsByCategoryViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetTopicsByCategoryUseCaseErrorResponse,
            TGetTopicsByCategoryResponseMiddleware
        >,
    ): viewModels.TTopicsByCategoryViewModel {
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
