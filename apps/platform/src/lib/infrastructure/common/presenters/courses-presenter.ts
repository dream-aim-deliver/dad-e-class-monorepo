import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoursesPresenterUtilities = {};

export const ListCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCoursesUseCaseResponse,
        viewModels.TCourseListViewModel,
        TCoursesPresenterUtilities
    >;

type TListCoursesResponseMiddleware = typeof ListCoursesResponseMiddleware;

export default class CoursesPresenter extends BasePresenter<
    useCaseModels.TListCoursesUseCaseResponse,
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
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: ListCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCoursesUseCaseErrorResponse,
            TListCoursesResponseMiddleware
        >,
    ): viewModels.TCourseListViewModel {
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
