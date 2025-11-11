import { viewModels } from '@maany_shr/e-class-models';
import {
    ListStudentAssignmentsUseCaseResponseSchema,
    TListStudentAssignmentsUseCaseResponse,
    TListStudentAssignmentsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListStudentAssignmentsPresenterUtilities = {};

export const ListStudentAssignmentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListStudentAssignmentsUseCaseResponse,
        viewModels.TListStudentAssignmentsViewModel,
        TListStudentAssignmentsPresenterUtilities
    >;

type TListStudentAssignmentsResponseMiddleware = typeof ListStudentAssignmentsResponseMiddleware;

export default class ListStudentAssignmentsPresenter extends BasePresenter<
    TListStudentAssignmentsUseCaseResponse,
    viewModels.TListStudentAssignmentsViewModel,
    TListStudentAssignmentsPresenterUtilities,
    TListStudentAssignmentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListStudentAssignmentsViewModel) => void,
        viewUtilities: TListStudentAssignmentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListStudentAssignmentsUseCaseResponseSchema,
                viewModel: viewModels.ListStudentAssignmentsViewModelSchema
            },
            middleware: ListStudentAssignmentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListStudentAssignmentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListStudentAssignmentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListStudentAssignmentsErrorResponse,
            TListStudentAssignmentsResponseMiddleware
        >,
    ): viewModels.TListStudentAssignmentsViewModel {
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
