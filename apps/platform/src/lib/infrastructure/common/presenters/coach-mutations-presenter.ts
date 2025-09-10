import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachMutationsPresenterUtilities = {};

// Add Coach Presenter
export const AddCourseCoachResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TAddCourseCoachUseCaseResponse,
        viewModels.TAddCoachViewModel,
        TCoachMutationsPresenterUtilities
    >;

type TAddCourseCoachResponseMiddleware = typeof AddCourseCoachResponseMiddleware;

export class AddCoachPresenter extends BasePresenter<
    useCaseModels.TAddCourseCoachUseCaseResponse,
    viewModels.TAddCoachViewModel,
    TCoachMutationsPresenterUtilities,
    TAddCourseCoachResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TAddCoachViewModel) => void,
        viewUtilities: TCoachMutationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.AddCourseCoachUseCaseResponseSchema,
                viewModel: viewModels.AddCoachViewModelSchema
            },
            middleware: AddCourseCoachResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TAddCourseCoachUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAddCoachViewModel {
        return {
            mode: 'success',
            data: {
                ...response.data
            }
        };
    }
    
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TAddCourseCoachUseCaseErrorResponse,
            TAddCourseCoachResponseMiddleware
        >,
    ): viewModels.TAddCoachViewModel {
        // You can add specific error type handling here based on errorType
        // For now, treating all errors as generic errors
        return {
            mode: 'error',
            data: {
                message: response.data.message || 'Failed to add coach',
                operation: response.data.operation || 'addCourseCoach',
                context: response.data.context || {}
            }
        };
    }
}

// Remove Coach Presenter
export const RemoveCourseCoachResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TRemoveCourseCoachUseCaseResponse,
        viewModels.TRemoveCoachViewModel,
        TCoachMutationsPresenterUtilities
    >;

type TRemoveCourseCoachResponseMiddleware = typeof RemoveCourseCoachResponseMiddleware;

export class RemoveCoachPresenter extends BasePresenter<
    useCaseModels.TRemoveCourseCoachUseCaseResponse,
    viewModels.TRemoveCoachViewModel,
    TCoachMutationsPresenterUtilities,
    TRemoveCourseCoachResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRemoveCoachViewModel) => void,
        viewUtilities: TCoachMutationsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.RemoveCourseCoachUseCaseResponseSchema,
                viewModel: viewModels.RemoveCoachViewModelSchema
            },
            middleware: RemoveCourseCoachResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TRemoveCourseCoachUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRemoveCoachViewModel {
        return {
            mode: 'success',
            data: {
                ...response.data
            }
        };
    }
    
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TRemoveCourseCoachUseCaseErrorResponse,
            TRemoveCourseCoachResponseMiddleware
        >,
    ): viewModels.TRemoveCoachViewModel {
        // You can add specific error type handling here based on errorType
        // For now, treating all errors as generic errors
        return {
            mode: 'error',
            data: {
                message: response.data.message || 'Failed to remove coach',
                operation: response.data.operation || 'removeCourseCoach',
                context: response.data.context || {}
            }
        };
    }
}
