import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseStudentsPresenterUtilities = {};

export const ListCourseStudentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCourseStudentsUseCaseResponse,
        viewModels.TCourseStudentsListViewModel,
        TCourseStudentsPresenterUtilities
    >;

type TListCourseStudentsResponseMiddleware = typeof ListCourseStudentsResponseMiddleware;

export default class ListCourseStudentsPresenter extends BasePresenter<
    useCaseModels.TListCourseStudentsUseCaseResponse,
    viewModels.TCourseStudentsListViewModel,
    TCourseStudentsPresenterUtilities,
    TListCourseStudentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseStudentsListViewModel) => void,
        viewUtilities: TCourseStudentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListCourseStudentsUseCaseResponseSchema,
                viewModel: viewModels.CourseStudentsListViewModelSchema
            },
            middleware: ListCourseStudentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCourseStudentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseStudentsListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCourseStudentsUseCaseErrorResponse,
            TListCourseStudentsResponseMiddleware
        >,
    ): viewModels.TCourseStudentsListViewModel {
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
