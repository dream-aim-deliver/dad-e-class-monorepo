import {
    cats,
    HomePageViewModels,
    GetHomePageUseCaseModels,
} from '@maany_shr/e-class-models';

export type THomePageUtilities = {};

export const GetHomePageResponseMiddleware =
    {} satisfies cats.TBaseResponseResponseMiddleware<
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
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
                data: {
                    errorType: response.data.errorType,
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }
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
