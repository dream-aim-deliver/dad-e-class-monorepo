import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListCourseStudentsErrorResponse,
    TListCourseStudentsResponse,
    ListCourseStudentsResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCourseStudentsPresenterUtilities = {};

export const ListCourseStudentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCourseStudentsResponse,
        viewModels.TListCourseStudentsViewModel,
        TListCourseStudentsPresenterUtilities
    >;

type TListCourseStudentsResponseMiddleware = typeof ListCourseStudentsResponseMiddleware;

export default class ListCourseStudentsPresenter extends BasePresenter<
    TListCourseStudentsResponse,
    viewModels.TListCourseStudentsViewModel,
    TListCourseStudentsPresenterUtilities,
    TListCourseStudentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCourseStudentsViewModel) => void,
        viewUtilities: TListCourseStudentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCourseStudentsResponseSchema,
                viewModel: viewModels.ListCourseStudentsViewModelSchema
            },
            middleware: ListCourseStudentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCourseStudentsResponse,
            { success: true }
        >,
    ): viewModels.TListCourseStudentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListCourseStudentsErrorResponse,
            TListCourseStudentsResponseMiddleware
        >,
    ): viewModels.TListCourseStudentsViewModel {
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
