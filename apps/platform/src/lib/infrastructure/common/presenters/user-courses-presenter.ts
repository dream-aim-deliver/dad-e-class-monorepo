import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUserCoursesPresenterUtilities = {};

export const ListUserCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListUserCoursesUseCaseResponse,
        viewModels.TUserCourseListViewModel,
        TUserCoursesPresenterUtilities
    >;

type TListUserCoursesResponseMiddleware =
    typeof ListUserCoursesResponseMiddleware;

export default class UserCoursesPresenter extends BasePresenter<
    useCaseModels.TListUserCoursesUseCaseResponse,
    viewModels.TUserCourseListViewModel,
    TUserCoursesPresenterUtilities,
    TListUserCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUserCourseListViewModel) => void,
        viewUtilities: TUserCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListUserCoursesUseCaseResponseSchema,
                viewModel: viewModels.UserCourseListViewModelSchema,
            },
            middleware: ListUserCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListUserCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUserCourseListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListUserCoursesUseCaseErrorResponse,
            TListUserCoursesResponseMiddleware
        >,
    ): viewModels.TUserCourseListViewModel {
        if (response.data.errorType === 'NotFound') {
            return {
                mode: 'not-found',
                data: {
                    type: response.data.errorType,
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    trace: undefined,
                },
            };
        }
        return {
            mode: 'kaboom',
            data: {
                type: response.data.errorType,
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
                trace: undefined,
            },
        };
    }
}
