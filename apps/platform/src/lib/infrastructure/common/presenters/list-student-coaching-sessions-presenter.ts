import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentCoachingSessionsPresenterUtilities = {};

export const ListStudentCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListStudentCoachingSessionsUseCaseResponse,
        viewModels.TStudentCoachingSessionsListViewModel,
        TStudentCoachingSessionsPresenterUtilities
    >;

type TListStudentCoachingSessionsResponseMiddleware = typeof ListStudentCoachingSessionsResponseMiddleware;

export default class ListStudentCoachingSessionsPresenter extends BasePresenter<
    useCaseModels.TListStudentCoachingSessionsUseCaseResponse,
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
                responseModel: useCaseModels.ListStudentCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.StudentCoachingSessionsListViewModelSchema
            },
            middleware: ListStudentCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListStudentCoachingSessionsUseCaseResponse,
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
            useCaseModels.TListStudentCoachingSessionsUseCaseErrorResponse,
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