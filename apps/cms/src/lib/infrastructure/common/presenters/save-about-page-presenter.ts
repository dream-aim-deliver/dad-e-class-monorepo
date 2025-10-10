import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveAboutPageUseCaseResponseSchema,
    TSaveAboutPageUseCaseResponse,
    TSaveAboutPageErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// Define presenter utilities type
// Add any utility functions/services needed by presenter methods
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveAboutPagePresenterUtilities = {};

// Define response middleware
// Add custom middleware logic here if needed for pre/post processing
export const SaveAboutPageResponseMiddleware = {} satisfies TBaseResponseResponseMiddleware<
    TSaveAboutPageUseCaseResponse,
    viewModels.TSaveAboutPageViewModel,
    TSaveAboutPagePresenterUtilities
>;

type TSaveAboutPageResponseMiddleware = typeof SaveAboutPageResponseMiddleware;

/**
 * Presenter for save-about-page feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class SaveAboutPagePresenter extends BasePresenter<
    TSaveAboutPageUseCaseResponse,
    viewModels.TSaveAboutPageViewModel,
    TSaveAboutPagePresenterUtilities,
    TSaveAboutPageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveAboutPageViewModel) => void,
        viewUtilities: TSaveAboutPagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveAboutPageUseCaseResponseSchema,
                viewModel: viewModels.SaveAboutPageViewModelSchema
            },
            middleware: SaveAboutPageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    /**
     * Transform successful usecase response to default view mode.
     *
     * TODO: Add any data transformation or business logic here
     * TODO: Map response fields to view model format if needed
     */
    presentSuccess(
        response: Extract<TSaveAboutPageUseCaseResponse, { success: true }>,
    ): viewModels.TSaveAboutPageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    /**
     * Transform error response to appropriate error view mode.
     *
     * TODO: Add custom error type mappings as needed
     * TODO: Handle specific error scenarios with custom modes
     */
    presentError(
        response: UnhandledErrorResponse<
            TSaveAboutPageErrorResponse,
            TSaveAboutPageResponseMiddleware
        >,
    ): viewModels.TSaveAboutPageViewModel {
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
