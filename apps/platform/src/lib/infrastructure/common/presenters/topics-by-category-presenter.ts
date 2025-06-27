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

export const ListTopicsByCategoryResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: ExtractStatusModel<
                    useCaseModels.TListTopicsByCategoryUseCaseResponse,
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
    useCaseModels.TListTopicsByCategoryUseCaseResponse,
    viewModels.TTopicsByCategoryViewModel,
    TTopicsByCategoryPresenterUtilities
>;

type TListTopicsByCategoryResponseMiddleware =
    typeof ListTopicsByCategoryResponseMiddleware;

export default class TopicsByCategoryPresenter extends BasePresenter<
    useCaseModels.TListTopicsByCategoryUseCaseResponse,
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
                    useCaseModels.ListTopicsByCategoryUseCaseResponseSchema,
                viewModel: viewModels.TopicsByCategoryViewModelSchema,
            },
            middleware: ListTopicsByCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListTopicsByCategoryUseCaseResponse,
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
            useCaseModels.TListTopicsByCategoryUseCaseErrorResponse,
            TListTopicsByCategoryResponseMiddleware
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
