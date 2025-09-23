import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpcomingCoachingSessionsPresenterUtilities = {};

export const ListUpcomingCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListUpcomingStudentCoachingSessionsUseCaseResponse,
        viewModels.TUpcomingCoachingSessionsListViewModel,
        TUpcomingCoachingSessionsPresenterUtilities
    >;

type TListUpcomingCoachingSessionsResponseMiddleware = typeof ListUpcomingCoachingSessionsResponseMiddleware;

export default class ListUpcomingCoachingSessionsPresenter extends BasePresenter<
    useCaseModels.TListUpcomingStudentCoachingSessionsUseCaseResponse,
    viewModels.TUpcomingCoachingSessionsListViewModel,
    TUpcomingCoachingSessionsPresenterUtilities,
    TListUpcomingCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpcomingCoachingSessionsListViewModel) => void,
        viewUtilities: TUpcomingCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListUpcomingStudentCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.UpcomingCoachingSessionsListViewModelSchema
            },
            middleware: ListUpcomingCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListUpcomingStudentCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpcomingCoachingSessionsListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListUpcomingStudentCoachingSessionsUseCaseErrorResponse,
            TListUpcomingCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TUpcomingCoachingSessionsListViewModel {
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