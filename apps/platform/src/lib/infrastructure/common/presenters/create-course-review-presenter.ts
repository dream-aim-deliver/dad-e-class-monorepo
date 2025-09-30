import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TCreateCourseReviewUseCaseResponse,
    CreateCourseReviewUseCaseResponseSchema,
    TCreateCourseReviewUseCaseErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCourseReviewPresenterUtilities = {};

export const CreateCourseReviewResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCourseReviewUseCaseResponse,
        viewModels.TCreateCourseReviewViewModel,
        TCreateCourseReviewPresenterUtilities
    >;

type TCreateCourseReviewResponseMiddleware = typeof CreateCourseReviewResponseMiddleware;

export default class CreateCourseReviewPresenter extends BasePresenter<
    TCreateCourseReviewUseCaseResponse,
    viewModels.TCreateCourseReviewViewModel,
    TCreateCourseReviewPresenterUtilities,
    TCreateCourseReviewResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCourseReviewViewModel) => void,
        viewUtilities: TCreateCourseReviewPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateCourseReviewUseCaseResponseSchema,
                viewModel: viewModels.CreateCourseReviewViewModelSchema
            },
            middleware: CreateCourseReviewResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateCourseReviewUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCourseReviewViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCourseReviewUseCaseErrorResponse,
            TCreateCourseReviewResponseMiddleware
        >,
    ): viewModels.TCreateCourseReviewViewModel {
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
