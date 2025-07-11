import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseAccessPresenterUtilities = {};

export const GetCourseAccessResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCourseAccessUseCaseResponse,
        viewModels.TCourseAccessViewModel,
        TCourseAccessPresenterUtilities
    >;

type TGetCourseAccessResponseMiddleware =
    typeof GetCourseAccessResponseMiddleware;

const roleHierarchy: Record<useCaseModels.TCourseRole, number> = {
    visitor: 0,
    student: 1,
    coach: 2,
    admin: 3,
};

export default class CourseAccessPresenter extends BasePresenter<
    useCaseModels.TGetCourseAccessUseCaseResponse,
    viewModels.TCourseAccessViewModel,
    TCourseAccessPresenterUtilities,
    TGetCourseAccessResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseAccessViewModel) => void,
        viewUtilities: TCourseAccessPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCourseAccessUseCaseResponseSchema,
                viewModel: viewModels.CourseAccessViewModelSchema,
            },
            middleware: GetCourseAccessResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCourseAccessUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseAccessViewModel {
        let highestRole: useCaseModels.TCourseRole | null = null;
        if (response.data.roles.length > 0) {
            highestRole = response.data.roles.reduce((a, b) =>
                roleHierarchy[a] > roleHierarchy[b] ? a : b,
            );
        }

        return {
            mode: 'default',
            data: {
                ...response.data,
                highestRole,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCourseAccessUseCaseErrorResponse,
            TGetCourseAccessResponseMiddleware
        >,
    ): viewModels.TCourseAccessViewModel {
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
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
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
