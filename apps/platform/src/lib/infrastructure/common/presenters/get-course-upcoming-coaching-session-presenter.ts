import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCourseUpcomingCoachingSessionUseCaseResponseSchema,
    TGetCourseUpcomingCoachingSessionUseCaseResponse,
    TGetCourseUpcomingCoachingSessionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCourseUpcomingCoachingSessionPresenterUtilities = {};

export const GetCourseUpcomingCoachingSessionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseUpcomingCoachingSessionUseCaseResponse,
        viewModels.TGetCourseUpcomingCoachingSessionViewModel,
        TGetCourseUpcomingCoachingSessionPresenterUtilities
    >;

type TGetCourseUpcomingCoachingSessionResponseMiddleware = typeof GetCourseUpcomingCoachingSessionResponseMiddleware;

export default class GetCourseUpcomingCoachingSessionPresenter extends BasePresenter<
    TGetCourseUpcomingCoachingSessionUseCaseResponse,
    viewModels.TGetCourseUpcomingCoachingSessionViewModel,
    TGetCourseUpcomingCoachingSessionPresenterUtilities,
    TGetCourseUpcomingCoachingSessionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCourseUpcomingCoachingSessionViewModel) => void,
        viewUtilities: TGetCourseUpcomingCoachingSessionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCourseUpcomingCoachingSessionUseCaseResponseSchema,
                viewModel: viewModels.GetCourseUpcomingCoachingSessionViewModelSchema
            },
            middleware: GetCourseUpcomingCoachingSessionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseUpcomingCoachingSessionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCourseUpcomingCoachingSessionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseUpcomingCoachingSessionErrorResponse,
            TGetCourseUpcomingCoachingSessionResponseMiddleware
        >,
    ): viewModels.TGetCourseUpcomingCoachingSessionViewModel {
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
