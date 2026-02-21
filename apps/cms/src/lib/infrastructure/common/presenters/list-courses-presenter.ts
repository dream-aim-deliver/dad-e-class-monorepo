import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListCoursesUseCaseResponse,
    ListCoursesUseCaseResponseSchema,
    TListCoursesUseCaseErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoursesPresenterUtilities = {};

export const ListCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoursesUseCaseResponse,
        viewModels.TCourseListViewModel,
        TCoursesPresenterUtilities
    >;

type TListCoursesResponseMiddleware = typeof ListCoursesResponseMiddleware;

export default class ListCoursesPresenter extends BasePresenter<
    TListCoursesUseCaseResponse,
    viewModels.TCourseListViewModel,
    TCoursesPresenterUtilities,
    TListCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseListViewModel) => void,
        viewUtilities: TCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoursesUseCaseResponseSchema,
                viewModel: viewModels.CourseListViewModelSchema
            },
            middleware: ListCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListCoursesUseCaseErrorResponse,
            TListCoursesResponseMiddleware
        >,
    ): viewModels.TCourseListViewModel {
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
