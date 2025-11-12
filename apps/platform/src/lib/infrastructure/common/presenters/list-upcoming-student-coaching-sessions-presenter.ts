import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUpcomingStudentCoachingSessionsUseCaseResponseSchema,
    TListUpcomingStudentCoachingSessionsUseCaseResponse,
    TListUpcomingStudentCoachingSessionsUseCaseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUpcomingStudentCoachingSessionsPresenterUtilities = {};

export const ListUpcomingStudentCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUpcomingStudentCoachingSessionsUseCaseResponse,
        viewModels.TListUpcomingStudentCoachingSessionsViewModel,
        TListUpcomingStudentCoachingSessionsPresenterUtilities
    >;

type TListUpcomingStudentCoachingSessionsResponseMiddleware = typeof ListUpcomingStudentCoachingSessionsResponseMiddleware;

export default class ListUpcomingStudentCoachingSessionsPresenter extends BasePresenter<
    TListUpcomingStudentCoachingSessionsUseCaseResponse,
    viewModels.TListUpcomingStudentCoachingSessionsViewModel,
    TListUpcomingStudentCoachingSessionsPresenterUtilities,
    TListUpcomingStudentCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUpcomingStudentCoachingSessionsViewModel) => void,
        viewUtilities: TListUpcomingStudentCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUpcomingStudentCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.ListUpcomingStudentCoachingSessionsViewModelSchema
            },
            middleware: ListUpcomingStudentCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUpcomingStudentCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUpcomingStudentCoachingSessionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUpcomingStudentCoachingSessionsUseCaseErrorResponse,
            TListUpcomingStudentCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TListUpcomingStudentCoachingSessionsViewModel {
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
