import { viewModels } from '@maany_shr/e-class-models';
import {
    ListStudentCoachingSessionsUseCaseResponseSchema,
    TListStudentCoachingSessionsUseCaseResponse,
    TListStudentCoachingSessionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentCoachingSessionsPresenterUtilities = {};

export const ListStudentCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListStudentCoachingSessionsUseCaseResponse,
        viewModels.TStudentCoachingSessionsListViewModel,
        TStudentCoachingSessionsPresenterUtilities
    >;

type TListStudentCoachingSessionsResponseMiddleware = typeof ListStudentCoachingSessionsResponseMiddleware;

export default class ListStudentCoachingSessionsPresenter extends BasePresenter<
    TListStudentCoachingSessionsUseCaseResponse,
    viewModels.TStudentCoachingSessionsListViewModel,
    TStudentCoachingSessionsPresenterUtilities,
    TListStudentCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TStudentCoachingSessionsListViewModel) => void,
        viewUtilities: TStudentCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListStudentCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.StudentCoachingSessionsListViewModelSchema
            },
            middleware: ListStudentCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListStudentCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TStudentCoachingSessionsListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListStudentCoachingSessionsErrorResponse,
            TListStudentCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TStudentCoachingSessionsListViewModel {
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