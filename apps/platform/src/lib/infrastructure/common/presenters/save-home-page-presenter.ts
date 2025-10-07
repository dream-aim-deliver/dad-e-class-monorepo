import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TSaveHomePageUseCaseResponse,
    TSaveHomePageErrorResponse,
    SaveHomePageUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';
import { viewModels } from '@maany_shr/e-class-models';

// Define presenter utilities type
// Add any utility functions/services needed by presenter methods
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveHomePagePresenterUtilities = {};

// Define response middleware
// Add custom middleware logic here if needed for pre/post processing
export const SaveHomePageResponseMiddleware = {} satisfies TBaseResponseResponseMiddleware<
    TSaveHomePageUseCaseResponse,
    viewModels.TSaveHomePageViewModel,
    TSaveHomePagePresenterUtilities
>;

type TSaveHomePageResponseMiddleware = typeof SaveHomePageResponseMiddleware;

/**
 * Presenter for save-home-page feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class SaveHomePagePresenter extends BasePresenter<
    TSaveHomePageUseCaseResponse,
    viewModels.TSaveHomePageViewModel,
    TSaveHomePagePresenterUtilities,
    TSaveHomePageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveHomePageViewModel) => void,
        viewUtilities: TSaveHomePagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveHomePageUseCaseResponseSchema,
                viewModel: viewModels.SaveHomePageViewModelSchema
            },
            middleware: SaveHomePageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    /**
     * Transform successful usecase response to default view mode.
     */
    presentSuccess(
        response: Extract<TSaveHomePageUseCaseResponse, { success: true }>,
    ): viewModels.TSaveHomePageViewModel {
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
            TSaveHomePageErrorResponse,
            TSaveHomePageResponseMiddleware
        >,
    ): viewModels.TSaveHomePageViewModel {
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
