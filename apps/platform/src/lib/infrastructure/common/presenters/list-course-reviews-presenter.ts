import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCourseReviewsUseCaseResponseSchema,
    TListCourseReviewsUseCaseResponse,
    TListCourseReviewsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCourseReviewsPresenterUtilities = {};

export const ListCourseReviewsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCourseReviewsUseCaseResponse,
        viewModels.TListCourseReviewsViewModel,
        TListCourseReviewsPresenterUtilities
    >;

type TListCourseReviewsResponseMiddleware = typeof ListCourseReviewsResponseMiddleware;

export default class ListCourseReviewsPresenter extends BasePresenter<
    TListCourseReviewsUseCaseResponse,
    viewModels.TListCourseReviewsViewModel,
    TListCourseReviewsPresenterUtilities,
    TListCourseReviewsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCourseReviewsViewModel) => void,
        viewUtilities: TListCourseReviewsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCourseReviewsUseCaseResponseSchema,
                viewModel: viewModels.ListCourseReviewsViewModelSchema
            },
            middleware: ListCourseReviewsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCourseReviewsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCourseReviewsViewModel {
        // Map backend response to expected UI format
        return {
            mode: 'default',
            data: {
                reviews: response.data.reviews.map(review => ({
                    id: review.id,
                    rating: review.rating,
                    createdAt: review.createdAt.toISOString(),
                    // Map backend 'review' to UI expected 'comment'
                    comment: review.review || '',
                    student: {
                        id: review.student.id,
                        // Map backend 'name'/'surname' to UI expected 'firstName'/'lastName'
                        firstName: review.student.name,
                        lastName: review.student.surname,
                        // Map backend 'avatarUrl' to UI expected 'avatarFile'
                        avatarFile: review.student.avatarUrl ? {
                            id: `avatar_${review.student.id}`,
                            name: `${review.student.name}_avatar`,
                            downloadUrl: review.student.avatarUrl,
                            size: 0,
                            category: 'image' as const
                        } : null
                    }
                }))
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCourseReviewsErrorResponse,
            TListCourseReviewsResponseMiddleware
        >,
    ): viewModels.TListCourseReviewsViewModel {
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
