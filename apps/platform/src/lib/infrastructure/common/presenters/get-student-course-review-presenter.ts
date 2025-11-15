import { viewModels } from '@maany_shr/e-class-models';
import {
    GetStudentCourseReviewUseCaseResponseSchema,
    TGetStudentCourseReviewUseCaseResponse,
    TGetStudentCourseReviewErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetStudentCourseReviewPresenterUtilities = {};

export const GetStudentCourseReviewResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetStudentCourseReviewUseCaseResponse,
        viewModels.TGetStudentCourseReviewViewModel,
        TGetStudentCourseReviewPresenterUtilities
    >;

type TGetStudentCourseReviewResponseMiddleware = typeof GetStudentCourseReviewResponseMiddleware;

export default class GetStudentCourseReviewPresenter extends BasePresenter<
    TGetStudentCourseReviewUseCaseResponse,
    viewModels.TGetStudentCourseReviewViewModel,
    TGetStudentCourseReviewPresenterUtilities,
    TGetStudentCourseReviewResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetStudentCourseReviewViewModel) => void,
        viewUtilities: TGetStudentCourseReviewPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetStudentCourseReviewUseCaseResponseSchema,
                viewModel: viewModels.GetStudentCourseReviewViewModelSchema
            },
            middleware: GetStudentCourseReviewResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetStudentCourseReviewUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetStudentCourseReviewViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetStudentCourseReviewErrorResponse,
            TGetStudentCourseReviewResponseMiddleware
        >,
    ): viewModels.TGetStudentCourseReviewViewModel {
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
