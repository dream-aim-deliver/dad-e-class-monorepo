import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUnscheduleCoachingSessionPresenterUtilities = {};

export const UnscheduleCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TUnscheduleCoachingSessionUseCaseResponse,
        viewModels.TUnscheduleCoachingSessionViewModel,
        TUnscheduleCoachingSessionPresenterUtilities
    >;

type TUnscheduleCoachingSessionResponseMiddleware =
    typeof UnscheduleCoachingSessionResponseMiddleware;

export default class UnscheduleCoachingSessionPresenter extends BasePresenter<
    useCaseModels.TUnscheduleCoachingSessionUseCaseResponse,
    viewModels.TUnscheduleCoachingSessionViewModel,
    TUnscheduleCoachingSessionPresenterUtilities,
    TUnscheduleCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TUnscheduleCoachingSessionViewModel,
        ) => void,
        viewUtilities: TUnscheduleCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.UnscheduleCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.UnscheduleCoachingSessionViewModelSchema
            },
            middleware: UnscheduleCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TUnscheduleCoachingSessionUseCaseResponse,
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
            useCaseModels.TUnscheduleCoachingSessionUseCaseErrorResponse,
            TUnscheduleCoachingSessionResponseMiddleware
        >,
    ): viewModels.TUnscheduleCoachingSessionViewModel {
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
