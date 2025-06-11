import { cats, viewModels, useCaseModels } from '@maany_shr/e-class-models';

export type TPlatformUtilities = {};

export const GetPlatformResponseMiddleware =
    {} satisfies cats.TBaseResponseResponseMiddleware<
        useCaseModels.TGetPlatformUseCaseResponse,
        viewModels.TPlatformViewModel,
        TPlatformUtilities
    >;

type TGetPlatformResponseMiddleware = typeof GetPlatformResponseMiddleware;

export default class PlatformReactPresenter extends cats.BasePresenter<
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
