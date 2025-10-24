import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetHomePageUseCaseResponse,
    TGetHomePageUseCaseErrorResponse,
    GetHomePageUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';
import { viewModels } from '@maany_shr/e-class-models';

// Define presenter utilities type
// Add any utility functions/services needed by presenter methods
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetHomePagePresenterUtilities = {};

// Define response middleware
// Add custom middleware logic here if needed for pre/post processing
export const GetHomePageResponseMiddleware = {} satisfies TBaseResponseResponseMiddleware<
    TGetHomePageUseCaseResponse,
    viewModels.TGetHomePageViewModel,
    TGetHomePagePresenterUtilities
>;

type TGetHomePageResponseMiddleware = typeof GetHomePageResponseMiddleware;

/**
 * Presenter for get-home-page feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class GetHomePagePresenter extends BasePresenter<
    TGetHomePageUseCaseResponse,
    viewModels.TGetHomePageViewModel,
    TGetHomePagePresenterUtilities,
    TGetHomePageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetHomePageViewModel) => void,
        viewUtilities: TGetHomePagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.GetHomePageViewModelSchema
            },
            middleware: GetHomePageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    /**
     * Transform successful usecase response to default view mode.
     */
    presentSuccess(
        response: Extract<TGetHomePageUseCaseResponse, { success: true }>,
    ): viewModels.TGetHomePageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    /**
     * Transform error response to appropriate error view mode.
     */
    presentError(
        response: UnhandledErrorResponse<
            TGetHomePageUseCaseErrorResponse,
            TGetHomePageResponseMiddleware
        >,
    ): viewModels.TGetHomePageViewModel {
        // Map NotFoundError to not-found mode
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

        // Default: map all other errors to kaboom mode
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
