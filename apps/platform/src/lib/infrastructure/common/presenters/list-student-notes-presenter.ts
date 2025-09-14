import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TStudentNotesPresenterUtilities = {};

export const ListStudentNotesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListStudentNotesUseCaseResponse,
        viewModels.TStudentNotesViewModel,
        TStudentNotesPresenterUtilities
    >;

type TListStudentNotesResponseMiddleware = typeof ListStudentNotesResponseMiddleware;

export default class ListStudentNotesPresenter extends BasePresenter<
    useCaseModels.TListStudentNotesUseCaseResponse,
    viewModels.TStudentNotesViewModel,
    TStudentNotesPresenterUtilities,
    TListStudentNotesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TStudentNotesViewModel) => void,
        viewUtilities: TStudentNotesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListStudentNotesUseCaseResponseSchema,
                viewModel: viewModels.StudentNotesViewModelSchema
            },
            middleware: ListStudentNotesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListStudentNotesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TStudentNotesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListStudentNotesUseCaseErrorResponse,
            TListStudentNotesResponseMiddleware
        >,
    ): viewModels.TStudentNotesViewModel {
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
