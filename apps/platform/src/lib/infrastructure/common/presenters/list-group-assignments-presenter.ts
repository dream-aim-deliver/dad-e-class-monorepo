import { viewModels } from '@maany_shr/e-class-models';
import {
    ListGroupAssignmentsUseCaseResponseSchema,
    TListGroupAssignmentsUseCaseResponse,
    TListGroupAssignmentsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListGroupAssignmentsPresenterUtilities = {};

export const ListGroupAssignmentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListGroupAssignmentsUseCaseResponse,
        viewModels.TListGroupAssignmentsViewModel,
        TListGroupAssignmentsPresenterUtilities
    >;

type TListGroupAssignmentsResponseMiddleware = typeof ListGroupAssignmentsResponseMiddleware;

export default class ListGroupAssignmentsPresenter extends BasePresenter<
    TListGroupAssignmentsUseCaseResponse,
    viewModels.TListGroupAssignmentsViewModel,
    TListGroupAssignmentsPresenterUtilities,
    TListGroupAssignmentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListGroupAssignmentsViewModel) => void,
        viewUtilities: TListGroupAssignmentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListGroupAssignmentsUseCaseResponseSchema,
                viewModel: viewModels.ListGroupAssignmentsViewModelSchema
            },
            middleware: ListGroupAssignmentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListGroupAssignmentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListGroupAssignmentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListGroupAssignmentsErrorResponse,
            TListGroupAssignmentsResponseMiddleware
        >,
    ): viewModels.TListGroupAssignmentsViewModel {
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
