import { cats, HomePageViewModels, GetHomePageUseCaseModels } from "@maany_shr/e-class-models"


type THomePageMiddlewareConfigMap = {
    showToast: { message: string };
    showWarning: { message: string };
    redirect: {
        url: string;
    }
}

type TGetHomePageResponseErrorTypes = GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'];
type TGetHomePageResponseProgressSteps = undefined;


const GetHomePageErrorResponseHandlerMap = {
        "errorType:AuthenticationError": "showToast",
        "errorType:CMSError": "showToast",
} satisfies cats.TBaseResponseActionHandlerConfig<
    TGetHomePageResponseErrorTypes,
    TGetHomePageResponseProgressSteps,
    THomePageMiddlewareConfigMap
>;

type TGetHomePageEventHandlerMap = typeof GetHomePageErrorResponseHandlerMap;

type TestHandledErrorResponse = cats.ExtractHandledErrorTypes<
    GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'],
    TGetHomePageEventHandlerMap
>
type TestUnhandledResponse =  cats.UnhandledErrorResponse<
        GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'],
        GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
        TGetHomePageEventHandlerMap
    >['errorType']

export default class HomePageReactPresenter extends cats.BasePresenter<
    HomePageViewModels.THomePageViewModel['mode'],
    HomePageViewModels.THomePageViewModel,
    GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'],
    undefined,
    GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
    THomePageMiddlewareConfigMap
> {
    getViewActionInputForError<K extends keyof THomePageMiddlewareConfigMap>(
        error: cats.ExtractStatusModel<GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse, false>,
        errorType: GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'],
        action: K
    ): THomePageMiddlewareConfigMap[K] {
        switch (action) {
            case "showToast":
                if(errorType !== "CMSError") {
                    throw new Error("Invalid error type for showToast action");
                }
                return {
                    message: error.data.message,
                } as THomePageMiddlewareConfigMap[K];
            case "showWarning":
                return {
                    message: error.data.message,
                } as THomePageMiddlewareConfigMap[K];
            case "redirect":
                return {
                    url: "/login",
                } as THomePageMiddlewareConfigMap[K];
        }
    }
    // Define the properties and methods for the HomePageReactPresenter
    // This class will handle the presentation logic for the home page in a React application

    constructor() {
        super(
            {
                schemas: {
                    responseModel: GetHomePageUseCaseModels.GetHomePageUsecaseResponseSchema,
                    viewModel: HomePageViewModels.HomePageViewModelSchema,
                },
                eventConfig: {
                    "errorType:AuthenticationError": "redirect",
                    "errorType:CMSError": "showToast",
                },
                callbacks: {
                    "redirect": async (data: { url: string }) => {
                        // Implement redirect logic here
                        console.log("Redirecting to:", data.url);
                    },
                    "showToast": async (data: { message: string }) => {
                        // Implement toast notification logic here
                        console.log("Toast message:", data.message);
                    },
                    "showWarning": async (data: { message: string }) => {
                        // Implement warning notification logic here
                        console.warn("Warning message:", data.message);
                    }
                }
            },

        );
    }

    presentSuccess(response: Extract<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse, { success: true }>): HomePageViewModels.THomePageViewModel {
        // Convert the use case response to a view model
        throw new Error("Method not implemented.");
    }
    presentError(response: cats.UnhandledErrorResponse<
        GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse['errorType'],
        GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
        TGetHomePageEventHandlerMap
    >): HomePageViewModels.THomePageViewModel {
        // Convert the use case error response to a view model
        const errorType = response.errorType;
        switch (errorType) {
            case "ValidationError":
                // Handle ValidationError
                return {
                    mode: "kaboom",
                    data: {
                        type: "ValidationError",
                        message: response.data.message,
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