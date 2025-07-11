import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseOutlinePresenterUtilities = {};

export const GetCourseOutlineResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCourseOutlineUseCaseResponse,
        viewModels.TCourseOutlineViewModel,
        TCourseOutlinePresenterUtilities
    >;

type TGetCourseOutlineResponseMiddleware =
    typeof GetCourseOutlineResponseMiddleware;

export default class CourseOutlinePresenter extends BasePresenter<
    useCaseModels.TGetCourseOutlineUseCaseResponse,
    viewModels.TCourseOutlineViewModel,
    TCourseOutlinePresenterUtilities,
    TGetCourseOutlineResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseOutlineViewModel) => void,
        viewUtilities: TCourseOutlinePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCourseOutlineUseCaseResponseSchema,
                viewModel: viewModels.CourseOutlineViewModelSchema,
            },
            middleware: GetCourseOutlineResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCourseOutlineUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseOutlineViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCourseOutlineUseCaseErrorResponse,
            TGetCourseOutlineResponseMiddleware
        >,
    ): viewModels.TCourseOutlineViewModel {
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
