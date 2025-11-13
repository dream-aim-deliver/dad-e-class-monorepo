import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachReviewsResponseSchema,
    TListCoachReviewsResponse,
    TListCoachReviewsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachReviewsPresenterUtilities = {};

export const ListCoachReviewsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachReviewsResponse,
        viewModels.TListCoachReviewsViewModel,
        TListCoachReviewsPresenterUtilities
    >;

type TListCoachReviewsResponseMiddleware = typeof ListCoachReviewsResponseMiddleware;

export default class ListCoachReviewsPresenter extends BasePresenter<
    TListCoachReviewsResponse,
    viewModels.TListCoachReviewsViewModel,
    TListCoachReviewsPresenterUtilities,
    TListCoachReviewsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachReviewsViewModel) => void,
        viewUtilities: TListCoachReviewsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachReviewsResponseSchema,
                viewModel: viewModels.ListCoachReviewsViewModelSchema
            },
            middleware: ListCoachReviewsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachReviewsResponse,
            { success: true }
        >,
    ): viewModels.TListCoachReviewsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachReviewsErrorResponse,
            TListCoachReviewsResponseMiddleware
        >,
    ): viewModels.TListCoachReviewsViewModel {
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
