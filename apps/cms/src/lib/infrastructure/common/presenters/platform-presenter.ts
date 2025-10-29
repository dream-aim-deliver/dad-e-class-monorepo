import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetPlatformUseCaseResponse,
    TGetPlatformUseCaseErrorResponse,
    GetPlatformUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPlatformPresenterUtilities = {};

export const GetPlatformResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPlatformUseCaseResponse,
        viewModels.TPlatformViewModel,
        TPlatformPresenterUtilities
    >;

type TGetPlatformResponseMiddleware = typeof GetPlatformResponseMiddleware;

export default class PlatformPresenter extends BasePresenter<
    TGetPlatformUseCaseResponse,
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
                responseModel: GetPlatformUseCaseResponseSchema,
                viewModel: viewModels.PlatformViewModelSchema
            },
            middleware: GetPlatformResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPlatformUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPlatformViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TGetPlatformUseCaseErrorResponse,
            TGetPlatformResponseMiddleware
        >,
    ): viewModels.TPlatformViewModel {
        return {
            mode: 'kaboom',
            data: {

                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context

            }
        };
    }
}
