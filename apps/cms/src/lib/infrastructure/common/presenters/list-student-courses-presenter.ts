import { viewModels } from '@maany_shr/e-class-models';
import {
    ListStudentCoursesUseCaseResponseSchema,
    TListStudentCoursesUseCaseResponse,
    TListStudentCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListStudentCoursesPresenterUtilities = {};

export const ListStudentCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListStudentCoursesUseCaseResponse,
        viewModels.TListStudentCoursesViewModel,
        TListStudentCoursesPresenterUtilities
    >;

type TListStudentCoursesResponseMiddleware = typeof ListStudentCoursesResponseMiddleware;

export default class ListStudentCoursesPresenter extends BasePresenter<
    TListStudentCoursesUseCaseResponse,
    viewModels.TListStudentCoursesViewModel,
    TListStudentCoursesPresenterUtilities,
    TListStudentCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListStudentCoursesViewModel) => void,
        viewUtilities: TListStudentCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListStudentCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListStudentCoursesViewModelSchema
            },
            middleware: ListStudentCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListStudentCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListStudentCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListStudentCoursesErrorResponse,
            TListStudentCoursesResponseMiddleware
        >,
    ): viewModels.TListStudentCoursesViewModel {
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
