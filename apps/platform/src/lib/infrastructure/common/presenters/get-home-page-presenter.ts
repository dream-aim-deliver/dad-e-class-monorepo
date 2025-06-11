import {
    cats,
    HomePageViewModels,
    GetHomePageUseCaseModels,
} from '@maany_shr/e-class-models';

export type THomePageUtilities = {
    redirect: (page: 'login') => void;
};

export const GetHomePageResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: cats.ExtractStatusModel<
                    GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
                    false
                >;
                currentViewModel: HomePageViewModels.THomePageViewModel;
                setViewModel: (
                    currentViewModel: HomePageViewModels.THomePageViewModel,
                    viewModel: HomePageViewModels.THomePageViewModel,
                ) => void;
            },
            callback: THomePageUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies cats.TBaseResponseResponseMiddleware<
    GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
    HomePageViewModels.THomePageViewModel,
    THomePageUtilities
>;

type TGetHomePageResponseMiddleware = typeof GetHomePageResponseMiddleware;

export default class HomePageReactPresenter extends cats.BasePresenter<
    GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
    HomePageViewModels.THomePageViewModel,
    THomePageUtilities,
    TGetHomePageResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: HomePageViewModels.THomePageViewModel,
        ) => void,
        viewUtilities: THomePageUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    GetHomePageUseCaseModels.GetHomePageUsecaseResponseSchema,
                viewModel: HomePageViewModels.HomePageViewModelSchema,
            },
            middleware: GetHomePageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
            { success: true }
        >,
    ): HomePageViewModels.THomePageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: cats.UnhandledErrorResponse<
            GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse,
            TGetHomePageResponseMiddleware
        >,
    ): HomePageViewModels.THomePageViewModel {
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
