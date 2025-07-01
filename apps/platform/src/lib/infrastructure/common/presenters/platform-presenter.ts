import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPlatformPresenterUtilities = {};

export const GetPlatformResponseMiddleware = {
} satisfies TBaseResponseResponseMiddleware<
    useCaseModels.TGetPlatformUseCaseResponse,
    viewModels.TPlatformViewModel,
    TPlatformPresenterUtilities
>;

type TGetPlatformResponseMiddleware = typeof GetPlatformResponseMiddleware;

export default class PlatformPresenter extends BasePresenter<
    useCaseModels.TGetPlatformUseCaseResponse,
    viewModels.TPlatformViewModel,
    TPlatformPresenterUtilities,
    TGetPlatformResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TPlatformViewModel) => void,
        viewUtilities: TPlatformPresenterUtilities,
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
        response: UnhandledErrorResponse<
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
