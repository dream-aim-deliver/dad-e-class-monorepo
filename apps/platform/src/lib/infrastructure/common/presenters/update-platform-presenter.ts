import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdatePlatformUseCaseResponseSchema,
    TUpdatePlatformUseCaseResponse,
    TUpdatePlatformErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdatePlatformPresenterUtilities = {};

export const UpdatePlatformResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdatePlatformUseCaseResponse,
        viewModels.TUpdatePlatformViewModel,
        TUpdatePlatformPresenterUtilities
    >;

type TUpdatePlatformResponseMiddleware = typeof UpdatePlatformResponseMiddleware;

export default class UpdatePlatformPresenter extends BasePresenter<
    TUpdatePlatformUseCaseResponse,
    viewModels.TUpdatePlatformViewModel,
    TUpdatePlatformPresenterUtilities,
    TUpdatePlatformResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdatePlatformViewModel) => void,
        viewUtilities: TUpdatePlatformPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdatePlatformUseCaseResponseSchema,
                viewModel: viewModels.UpdatePlatformViewModelSchema
            },
            middleware: UpdatePlatformResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdatePlatformUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdatePlatformViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdatePlatformErrorResponse,
            TUpdatePlatformResponseMiddleware
        >,
    ): viewModels.TUpdatePlatformViewModel {
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
