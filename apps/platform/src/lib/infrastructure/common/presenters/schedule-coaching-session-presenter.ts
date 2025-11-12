import { viewModels } from '@maany_shr/e-class-models';
import {
    ScheduleCoachingSessionUseCaseResponseSchema,
    TScheduleCoachingSessionUseCaseResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TScheduleCoachingSessionPresenterUtilities = {};

export const ScheduleCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TScheduleCoachingSessionUseCaseResponse,
        viewModels.TScheduleCoachingSessionViewModel,
        TScheduleCoachingSessionPresenterUtilities
    >;

type TScheduleCoachingSessionResponseMiddleware = typeof ScheduleCoachingSessionResponseMiddleware;

export default class ScheduleCoachingSessionPresenter extends BasePresenter<
    TScheduleCoachingSessionUseCaseResponse,
    viewModels.TScheduleCoachingSessionViewModel,
    TScheduleCoachingSessionPresenterUtilities,
    TScheduleCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TScheduleCoachingSessionViewModel) => void,
        viewUtilities: TScheduleCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ScheduleCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.ScheduleCoachingSessionViewModelSchema
            },
            middleware: ScheduleCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TScheduleCoachingSessionUseCaseResponse,
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
            any,
            TScheduleCoachingSessionResponseMiddleware
        >,
    ): viewModels.TScheduleCoachingSessionViewModel {
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
