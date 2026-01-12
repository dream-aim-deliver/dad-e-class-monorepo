import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCoachProfileAccessResponseSchema,
    TGetCoachProfileAccessResponse,
    TGetCoachProfileAccessErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCoachProfileAccessPresenterUtilities = {};

export const GetCoachProfileAccessResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCoachProfileAccessResponse,
        viewModels.TGetCoachProfileAccessViewModel,
        TGetCoachProfileAccessPresenterUtilities
    >;

type TGetCoachProfileAccessResponseMiddleware = typeof GetCoachProfileAccessResponseMiddleware;

/**
 * Presenter for get-coach-profile-access feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class GetCoachProfileAccessPresenter extends BasePresenter<
    TGetCoachProfileAccessResponse,
    viewModels.TGetCoachProfileAccessViewModel,
    TGetCoachProfileAccessPresenterUtilities,
    TGetCoachProfileAccessResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCoachProfileAccessViewModel) => void,
        viewUtilities: TGetCoachProfileAccessPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCoachProfileAccessResponseSchema,
                viewModel: viewModels.GetCoachProfileAccessViewModelSchema
            },
            middleware: GetCoachProfileAccessResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCoachProfileAccessResponse,
            { success: true }
        >,
    ): viewModels.TGetCoachProfileAccessViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCoachProfileAccessErrorResponse,
            TGetCoachProfileAccessResponseMiddleware
        >,
    ): viewModels.TGetCoachProfileAccessViewModel {
        // NotFoundError and ForbiddenError both show 404 to avoid revealing profile existence
        if (response.data.errorType === 'NotFoundError' ||
            response.data.errorType === 'ForbiddenError') {
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
