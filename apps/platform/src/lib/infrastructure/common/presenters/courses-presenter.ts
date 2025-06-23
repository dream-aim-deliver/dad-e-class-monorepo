import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TCoursesPresenterUtilities = {};

export const GetCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCoursesUseCaseResponse,
        viewModels.TCourseListViewModel,
        TCoursesPresenterUtilities
    >;

type TGetCoursesResponseMiddleware = typeof GetCoursesResponseMiddleware;

export default class CoursesPresenter extends BasePresenter<
    useCaseModels.TGetCoursesUseCaseResponse,
    viewModels.TCourseListViewModel,
    TCoursesPresenterUtilities,
    TGetCoursesResponseMiddleware
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
            middleware: GetCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCoursesUseCaseResponse,
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
            useCaseModels.TGetCoursesUseCaseErrorResponse,
            TGetCoursesResponseMiddleware
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
