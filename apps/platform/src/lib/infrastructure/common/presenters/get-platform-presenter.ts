import { cats, viewModels, useCaseModels } from '@maany_shr/e-class-models';

export type TPlatformUtilities = {
    redirect: (page: 'login') => Promise<void> | void;
};

export const GetPlatformResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: cats.ExtractStatusModel<
                    useCaseModels.TGetPlatformUseCaseResponse,
                    false
                >;
                currentViewModel: viewModels.TPlatformViewModel;
                setViewModel: (
                    currentViewModel: viewModels.TPlatformViewModel,
                    viewModel: viewModels.TPlatformViewModel,
                ) => void;
            },
            callback: TPlatformUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies cats.TBaseResponseResponseMiddleware<
    useCaseModels.TGetPlatformUseCaseResponse,
    viewModels.TPlatformViewModel,
    TPlatformUtilities
>;

type TGetPlatformResponseMiddleware = typeof GetPlatformResponseMiddleware;

export default class PlatformPresenter extends cats.BasePresenter<
    useCaseModels.TGetPlatformUseCaseResponse,
    viewModels.TPlatformViewModel,
    TPlatformUtilities,
    TGetPlatformResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
        viewUtilities: TPlatformUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetPlatformUseCaseResponseSchema,
                viewModel: viewModels.PlatformViewModelSchema,
            },
            middleware: GetPlatformResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetPlatformUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPlatformViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: cats.UnhandledErrorResponse<
            useCaseModels.TGetPlatformUseCaseErrorResponse,
            TGetPlatformResponseMiddleware
        >,
    ): viewModels.TPlatformViewModel {
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
