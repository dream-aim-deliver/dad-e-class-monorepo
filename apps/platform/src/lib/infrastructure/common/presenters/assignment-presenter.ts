import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';
import {
    TGetAssignmentUseCaseResponse,
    TGetAssignmentUseCaseErrorResponse,
    GetAssignmentUseCaseResponseSchema,
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetAssignmentPresenterUtilities = {};

export const GetAssignmentResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetAssignmentUseCaseResponse,
        viewModels.TGetAssignmentViewModel,
        TGetAssignmentPresenterUtilities
    >;

type TGetAssignmentResponseMiddleware =
    typeof GetAssignmentResponseMiddleware;

export default class GetAssignmentPresenter extends BasePresenter<
    TGetAssignmentUseCaseResponse,
    viewModels.TGetAssignmentViewModel,
    TGetAssignmentPresenterUtilities,
    TGetAssignmentResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TGetAssignmentViewModel,
        ) => void,
        viewUtilities: TGetAssignmentPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetAssignmentUseCaseResponseSchema,
                viewModel: viewModels.GetAssignmentViewModelSchema,
            },
            middleware: GetAssignmentResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            TGetAssignmentUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetAssignmentViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetAssignmentUseCaseErrorResponse,
            TGetAssignmentResponseMiddleware
        >,
    ): viewModels.TGetAssignmentViewModel {
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
                context: response.data.context,
            },
        };
    }
}

export { GetAssignmentPresenter as AssignmentPresenter };
