import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPlatformUseCaseResponseSchema,
    TGetPlatformUseCaseResponse,
    TGetPlatformUseCaseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPlatformPresenterUtilities = {};

export const GetPlatformResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPlatformUseCaseResponse,
        viewModels.TGetPlatformViewModel,
        TGetPlatformPresenterUtilities
    >;

type TGetPlatformResponseMiddleware = typeof GetPlatformResponseMiddleware;

export default class GetPlatformPresenter extends BasePresenter<
    TGetPlatformUseCaseResponse,
    viewModels.TGetPlatformViewModel,
    TGetPlatformPresenterUtilities,
    TGetPlatformResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPlatformViewModel) => void,
        viewUtilities: TGetPlatformPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPlatformUseCaseResponseSchema,
                viewModel: viewModels.GetPlatformViewModelSchema
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
    ): viewModels.TGetPlatformViewModel {
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
    ): viewModels.TGetPlatformViewModel {
        if (response.data.errorType === 'NotFoundError') {
            return {
                mode: 'not-found',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }
            };
        }
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
