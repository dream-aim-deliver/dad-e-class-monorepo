import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetCourseAccessUseCaseResponse,
    TGetCourseAccessErrorResponse,
    GetCourseAccessUseCaseResponseSchema,
    TEClassRole
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseAccessPresenterUtilities = {};

export const GetCourseAccessResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCourseAccessUseCaseResponse,
        viewModels.TGetCourseAccessViewModel,
        TCourseAccessPresenterUtilities
    >;

type TGetCourseAccessResponseMiddleware =
    typeof GetCourseAccessResponseMiddleware;

const roleHierarchy: Record<TEClassRole, number> = {
    visitor: 0,
    student: 1,
    coach: 2,
    course_creator: 3,
    admin: 4,
    superadmin: 5
};

export default class CourseAccessPresenter extends BasePresenter<
    TGetCourseAccessUseCaseResponse,
    viewModels.TGetCourseAccessViewModel,
    TCourseAccessPresenterUtilities,
    TGetCourseAccessResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCourseAccessViewModel) => void,
        viewUtilities: TCourseAccessPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    GetCourseAccessUseCaseResponseSchema,
                viewModel: viewModels.GetCourseAccessViewModelSchema
            },
            middleware: GetCourseAccessResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCourseAccessUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCourseAccessViewModel {
        let highestRole: TEClassRole | null = null;
        if (response.data.roles.length > 0) {
            highestRole = response.data.roles.reduce((a, b) =>
                roleHierarchy[a] > roleHierarchy[b] ? a : b,
            );
        }

        return {
            mode: 'default',
            data: {
                ...response.data,
                highestRole
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCourseAccessErrorResponse,
            TGetCourseAccessResponseMiddleware
        >,
    ): viewModels.TGetCourseAccessViewModel {
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
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
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
