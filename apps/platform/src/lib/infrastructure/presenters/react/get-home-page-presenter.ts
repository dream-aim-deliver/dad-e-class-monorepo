import { cats, HomePageViewModels, GetHomePageUseCaseModels } from "@maany_shr/e-class-models"
import { useMemo } from "react";


type THomePageMiddlewareConfigMap = {
    showToast: { message: string };
    showWarning: { message: string };
    redirect: {
        url: string;
    }
}

type TGetHomePageResponseErrorTypes = GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse["data"]['errorType'];
type TGetHomePageResponseProgressSteps = undefined;


const GetHomePageErrorResponseHandlerMap = {
    "errorType:AuthenticationError": "redirect", // replace wuth a callback
    "errorType:CMSError": "showToast",
} satisfies cats.TBaseResponseActionHandlerConfig<
    TGetHomePageResponseErrorTypes,
    TGetHomePageResponseProgressSteps,
    THomePageMiddlewareConfigMap
>;
type TGetHomePageEventHandlerMap = typeof GetHomePageErrorResponseHandlerMap;

type HandledErrorTypes = cats.ExtractHandledErrorTypes<
    TGetHomePageResponseErrorTypes,
    TGetHomePageEventHandlerMap
>;

type TestMid = Extract<GetHomePageUseCaseModels.TGetHomePageUsecaseResponse, { success: false }>['data']
type TestExclude = {
    success: false,
    data: Exclude<TestMid, {
        errorType: HandledErrorTypes;
    }>;
}


type UnhandledErrorTypes = cats.UnhandledErrorResponse<
    TGetHomePageResponseErrorTypes,
    GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse,
    TGetHomePageEventHandlerMap
>
export default class HomePageReactPresenter extends cats.BasePresenter<
    HomePageViewModels.THomePageViewModel['mode'],
    HomePageViewModels.THomePageViewModel,
    GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse["data"]['errorType'],
    undefined,
    GetHomePageUseCaseModels.TGetHomePageUsecaseResponse,
    THomePageMiddlewareConfigMap
> {
    getViewActionInputForError<K extends keyof THomePageMiddlewareConfigMap>(
        error: cats.ExtractStatusModel<GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse, false>,
        errorType: GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse["data"]['errorType'],
        action: K
    ): THomePageMiddlewareConfigMap[K] {
        switch (action) {
            case "showToast":
                if (errorType === "AuthenticationError") {
                    // Handle authentication error specifically
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

    constructor(
        setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
    ) {
        super(
            {
                schemas: {
                    responseModel: GetHomePageUseCaseModels.GetHomePageUsecaseResponseSchema,
                    viewModel: HomePageViewModels.HomePageViewModelSchema,
                },
                eventConfig: GetHomePageErrorResponseHandlerMap,
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
                },
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
        TGetHomePageResponseErrorTypes,
        GetHomePageUseCaseModels.TGetHomePageUsecaseErrorResponse,
        TGetHomePageEventHandlerMap
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

export function useGetHomePagePresenter(
    setViewModel: (viewModel: HomePageViewModels.THomePageViewModel) => void,
) {
    // TODO: VIKA Use Toast and Redirect can be obtained here from a context or from next/router
    const presenter = useMemo(() => {
        return new HomePageReactPresenter(setViewModel);
    }, [setViewModel]);
    return {
        presenter,
    };
}