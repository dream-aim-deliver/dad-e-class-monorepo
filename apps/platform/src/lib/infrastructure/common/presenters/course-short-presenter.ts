import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseShortPresenterUtilities = {};

export const GetCourseShortResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCourseShortUseCaseResponse,
        viewModels.TCourseShortViewModel,
        TCourseShortPresenterUtilities
    >;

type TGetCourseShortResponseMiddleware =
    typeof GetCourseShortResponseMiddleware;

export default class CourseShortPresenter extends BasePresenter<
    useCaseModels.TGetCourseShortUseCaseResponse,
    viewModels.TCourseShortViewModel,
    TCourseShortPresenterUtilities,
    TGetCourseShortResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseShortViewModel) => void,
        viewUtilities: TCourseShortPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCourseShortUseCaseResponseSchema,
                viewModel: viewModels.CourseShortViewModelSchema,
            },
            middleware: GetCourseShortResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCourseShortUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseShortViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCourseShortUseCaseErrorResponse,
            TGetCourseShortResponseMiddleware
        >,
    ): viewModels.TCourseShortViewModel {
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
