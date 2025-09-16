import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCourseReviewsPresenterUtilities = {};

export const ListCourseReviewsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCourseReviewsUseCaseResponse,
        viewModels.TCourseReviewsViewModel,
        TCourseReviewsPresenterUtilities
    >;

type TListCourseReviewsResponseMiddleware =
    typeof ListCourseReviewsResponseMiddleware;

export default class CourseReviewsPresenter extends BasePresenter<
    useCaseModels.TListCourseReviewsUseCaseResponse,
    viewModels.TCourseReviewsViewModel,
    TCourseReviewsPresenterUtilities,
    TListCourseReviewsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseReviewsViewModel) => void,
        viewUtilities: TCourseReviewsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListCourseReviewsUseCaseResponseSchema,
                viewModel: viewModels.CourseReviewsViewModelSchema
            },
            middleware: ListCourseReviewsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCourseReviewsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseReviewsViewModel {
        return {
            mode: 'default',
            data: response.data
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCourseReviewsUseCaseErrorResponse,
            TListCourseReviewsResponseMiddleware
        >,
    ): viewModels.TCourseReviewsViewModel {
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
