import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachStudentCoursesResponseSchema,
    TListCoachStudentCoursesResponse,
    TListCoachStudentCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachStudentCoursesPresenterUtilities = {};

export const ListCoachStudentCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachStudentCoursesResponse,
        viewModels.TListCoachStudentCoursesViewModel,
        TListCoachStudentCoursesPresenterUtilities
    >;

type TListCoachStudentCoursesResponseMiddleware = typeof ListCoachStudentCoursesResponseMiddleware;

export default class ListCoachStudentCoursesPresenter extends BasePresenter<
    TListCoachStudentCoursesResponse,
    viewModels.TListCoachStudentCoursesViewModel,
    TListCoachStudentCoursesPresenterUtilities,
    TListCoachStudentCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachStudentCoursesViewModel) => void,
        viewUtilities: TListCoachStudentCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachStudentCoursesResponseSchema,
                viewModel: viewModels.ListCoachStudentCoursesViewModelSchema
            },
            middleware: ListCoachStudentCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachStudentCoursesResponse,
            { success: true }
        >,
    ): viewModels.TListCoachStudentCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachStudentCoursesErrorResponse,
            TListCoachStudentCoursesResponseMiddleware
        >,
    ): viewModels.TListCoachStudentCoursesViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }
            };
        }
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
