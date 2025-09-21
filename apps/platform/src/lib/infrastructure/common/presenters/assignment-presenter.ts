import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAssignmentPresenterUtilities = {};

export const GetAssignmentResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetAssignmentUseCaseResponse,
        viewModels.TAssignmentViewModel,
        TAssignmentPresenterUtilities
    >;

type TGetAssignmentResponseMiddleware =
    typeof GetAssignmentResponseMiddleware;

export default class AssignmentPresenter extends BasePresenter<
    useCaseModels.TGetAssignmentUseCaseResponse,
    viewModels.TAssignmentViewModel,
    TAssignmentPresenterUtilities,
    TGetAssignmentResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAssignmentViewModel,
        ) => void,
        viewUtilities: TAssignmentPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetAssignmentUseCaseResponseSchema,
                viewModel: viewModels.AssignmentViewModelSchema,
            },
            middleware: GetAssignmentResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetAssignmentUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAssignmentViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetAssignmentUseCaseErrorResponse,
            TGetAssignmentResponseMiddleware
        >,
    ): viewModels.TAssignmentViewModel {
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
