import { cats, HomePageViewModels, GetHomePageUseCaseModels } from "@maany_shr/e-class-models"

export type THomePageUtilities = {
    showToast: (data: { message: string }) => Promise<void> | void;
    showWarning: (data: { message: string }) => Promise<void> | void;
    redirect: (page: 'login-page') => Promise<void> | void;
};

export const GetHomePageResponseMiddleware = {
    "errorType:AuthenticationError": {
        "redirect": async(
            context: {
                response: cats.ExtractStatusModel<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse, false>,
                currentViewModel: HomePageViewModels.THomePageViewModel,
                setViewModel: (currentViewModel: HomePageViewModels.THomePageViewModel, viewModel: HomePageViewModels.THomePageViewModel) => void,
            },
            callback: THomePageUtilities["redirect"],
        ) => {
            // Handle authentication error by redirecting to the login page
            // You can implement the redirect logic here if needed
            const { response, setViewModel } = context;
            const viewModel: HomePageViewModels.THomePageViewModel = {
                mode: "kaboom",
                data: {
                    type: "AuthenticationError",
                    message: response.data.message,
                    trace: 'something',
                },
            };
            callback('login-page');
        }
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
        setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
        viewUtilities: THomePageUtilities
    ) {
        super(
            {
                schemas: {
                    responseModel: GetHomePageUseCaseModels.GetHomePageUsecaseResponseSchema,
                    viewModel: HomePageViewModels.HomePageViewModelSchema,
                },
                middleware: GetHomePageResponseMiddleware,
                viewUtilities: viewUtilities,
                setViewModel: setViewModel,
            },
        );
    }

    presentSuccess(response: Extract<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse, { success: true }>): HomePageViewModels.THomePageViewModel {
        return {
            mode: "default",
            data: {
                banner: {
                    title: response.data.title,
                    description: response.data.description,
                    videoId: response.data.videoId,
                    thumbnailUrl: response.data.thumbnailUrl,
                },
            }
        }
    }
    presentError(response: cats.UnhandledErrorResponse<
        GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse,
        TGetHomePageResponseMiddleware
    >): HomePageViewModels.THomePageViewModel {
        // Convert the use case error response to a view model
        const errorType = response.data.errorType;
        switch (errorType) {
            case "ValidationError":
                // Handle ValidationError
                return {
                    mode: "kaboom",
                    data: {
                        type: "ValidationError",
                        message: response.data.message,
                        operation: response.data.operation,
                        context: response.data.context,
                        trace: 'something',
                    }
                };
            default:
                // Handle unknown error type
                return {
                    mode: "kaboom",
                    data: {
                        type: "UnknownError",
                        message: "An unknown error occurred",
                        trace: 'something',
                    }
                };
        }
    }
}

