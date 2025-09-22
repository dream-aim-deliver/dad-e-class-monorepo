import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TScheduleCoachingSessionPresenterUtilities = {};

export const ScheduleCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TScheduleCoachingSessionUseCaseResponse,
        viewModels.TScheduleCoachingSessionViewModel,
        TScheduleCoachingSessionPresenterUtilities
    >;

type TScheduleCoachingSessionResponseMiddleware =
    typeof ScheduleCoachingSessionResponseMiddleware;

export default class ScheduleCoachingSessionPresenter extends BasePresenter<
    useCaseModels.TScheduleCoachingSessionUseCaseResponse,
    viewModels.TScheduleCoachingSessionViewModel,
    TScheduleCoachingSessionPresenterUtilities,
    TScheduleCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TScheduleCoachingSessionViewModel,
        ) => void,
        viewUtilities: TScheduleCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ScheduleCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.ScheduleCoachingSessionViewModelSchema
            },
            middleware: ScheduleCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TScheduleCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TScheduleCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TScheduleCoachingSessionUseCaseErrorResponse,
            TScheduleCoachingSessionResponseMiddleware
        >,
    ): viewModels.TScheduleCoachingSessionViewModel {
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