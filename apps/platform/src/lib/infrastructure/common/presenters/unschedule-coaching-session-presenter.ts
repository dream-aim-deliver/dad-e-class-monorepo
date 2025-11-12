import { viewModels } from '@maany_shr/e-class-models';
import {
    UnscheduleCoachingSessionUseCaseResponseSchema,
    TUnscheduleCoachingSessionUseCaseResponse,
    TUnscheduleCoachingSessionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUnscheduleCoachingSessionPresenterUtilities = {};

export const UnscheduleCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUnscheduleCoachingSessionUseCaseResponse,
        viewModels.TUnscheduleCoachingSessionViewModel,
        TUnscheduleCoachingSessionPresenterUtilities
    >;

type TUnscheduleCoachingSessionResponseMiddleware = typeof UnscheduleCoachingSessionResponseMiddleware;

export default class UnscheduleCoachingSessionPresenter extends BasePresenter<
    TUnscheduleCoachingSessionUseCaseResponse,
    viewModels.TUnscheduleCoachingSessionViewModel,
    TUnscheduleCoachingSessionPresenterUtilities,
    TUnscheduleCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUnscheduleCoachingSessionViewModel) => void,
        viewUtilities: TUnscheduleCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UnscheduleCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.UnscheduleCoachingSessionViewModelSchema
            },
            middleware: UnscheduleCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUnscheduleCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUnscheduleCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUnscheduleCoachingSessionErrorResponse,
            TUnscheduleCoachingSessionResponseMiddleware
        >,
    ): viewModels.TUnscheduleCoachingSessionViewModel {
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
