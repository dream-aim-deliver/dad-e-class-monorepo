import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type THomePageUtilities = {
    redirect: (page: 'login') => Promise<void> | void;
};

export const GetHomePageResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: ExtractStatusModel<
                    useCaseModels.TGetHomePageUseCaseResponse,
                    false
                >;
                currentViewModel: viewModels.THomePageViewModel;
                setViewModel: (
                    currentViewModel: viewModels.THomePageViewModel,
                    viewModel: viewModels.THomePageViewModel,
                ) => void;
            },
            callback: THomePageUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies TBaseResponseResponseMiddleware<
    useCaseModels.TGetHomePageUseCaseResponse,
    viewModels.THomePageViewModel,
    THomePageUtilities
>;

type TGetHomePageResponseMiddleware = typeof GetHomePageResponseMiddleware;

export default class HomePagePresenter extends BasePresenter<
    useCaseModels.TGetHomePageUseCaseResponse,
    viewModels.THomePageViewModel,
    THomePageUtilities,
    TGetHomePageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.THomePageViewModel) => void,
        viewUtilities: THomePageUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: GetHomePageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetHomePageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.THomePageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetHomePageUseCaseErrorResponse,
            TGetHomePageResponseMiddleware
        >,
    ): viewModels.THomePageViewModel {
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
