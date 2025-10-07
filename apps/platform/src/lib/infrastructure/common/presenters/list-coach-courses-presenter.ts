import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListCoachCoursesUseCaseResponse,
    TListCoachCoursesErrorResponse,
    ListCoachCoursesUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';
import { viewModels } from '@maany_shr/e-class-models';

// Define presenter utilities type
// Add any utility functions/services needed by presenter methods
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachCoursesPresenterUtilities = {};

// Define response middleware
// Add custom middleware logic here if needed for pre/post processing
export const ListCoachCoursesResponseMiddleware = {} satisfies TBaseResponseResponseMiddleware<
    TListCoachCoursesUseCaseResponse,
    viewModels.TListCoachCoursesViewModel,
    TListCoachCoursesPresenterUtilities
>;

type TListCoachCoursesResponseMiddleware = typeof ListCoachCoursesResponseMiddleware;

/**
 * Presenter for list-coach-courses feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class ListCoachCoursesPresenter extends BasePresenter<
    TListCoachCoursesUseCaseResponse,
    viewModels.TListCoachCoursesViewModel,
    TListCoachCoursesPresenterUtilities,
    TListCoachCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachCoursesViewModel) => void,
        viewUtilities: TListCoachCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListCoachCoursesViewModelSchema
            },
            middleware: ListCoachCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    /**
     * Transform successful usecase response to default view mode.
     */
    presentSuccess(
        response: Extract<TListCoachCoursesUseCaseResponse, { success: true }>,
    ): viewModels.TListCoachCoursesViewModel {
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
            TListCoachCoursesErrorResponse,
            TListCoachCoursesResponseMiddleware
        >,
    ): viewModels.TListCoachCoursesViewModel {
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
