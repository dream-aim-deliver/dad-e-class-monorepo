import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCoachIntroductionUseCaseResponseSchema,
    TGetCoachIntroductionUseCaseResponse,
    TGetCoachIntroductionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCoachIntroductionPresenterUtilities = {};

export const GetCoachIntroductionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCoachIntroductionUseCaseResponse,
        viewModels.TGetCoachIntroductionViewModel,
        TGetCoachIntroductionPresenterUtilities
    >;

type TGetCoachIntroductionResponseMiddleware = typeof GetCoachIntroductionResponseMiddleware;

/**
 * Presenter for get-coach-introduction feature.
 *
 * Transforms usecase responses into view models for UI consumption.
 * Maps success responses to 'default' view mode and errors to appropriate error modes.
 */
export default class GetCoachIntroductionPresenter extends BasePresenter<
    TGetCoachIntroductionUseCaseResponse,
    viewModels.TGetCoachIntroductionViewModel,
    TGetCoachIntroductionPresenterUtilities,
    TGetCoachIntroductionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCoachIntroductionViewModel) => void,
        viewUtilities: TGetCoachIntroductionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCoachIntroductionUseCaseResponseSchema,
                viewModel: viewModels.GetCoachIntroductionViewModelSchema
            },
            middleware: GetCoachIntroductionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCoachIntroductionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCoachIntroductionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCoachIntroductionErrorResponse,
            TGetCoachIntroductionResponseMiddleware
        >,
    ): viewModels.TGetCoachIntroductionViewModel {
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
