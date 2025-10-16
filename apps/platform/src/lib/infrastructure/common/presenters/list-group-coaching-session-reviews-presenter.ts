import { viewModels } from '@maany_shr/e-class-models';
import {
    ListGroupCoachingSessionReviewsUseCaseResponseSchema,
    TListGroupCoachingSessionReviewsUseCaseResponse,
    TListGroupCoachingSessionReviewsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListGroupCoachingSessionReviewsPresenterUtilities = {};

export const ListGroupCoachingSessionReviewsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListGroupCoachingSessionReviewsUseCaseResponse,
        viewModels.TListGroupCoachingSessionReviewsViewModel,
        TListGroupCoachingSessionReviewsPresenterUtilities
    >;

type TListGroupCoachingSessionReviewsResponseMiddleware = typeof ListGroupCoachingSessionReviewsResponseMiddleware;

export default class ListGroupCoachingSessionReviewsPresenter extends BasePresenter<
    TListGroupCoachingSessionReviewsUseCaseResponse,
    viewModels.TListGroupCoachingSessionReviewsViewModel,
    TListGroupCoachingSessionReviewsPresenterUtilities,
    TListGroupCoachingSessionReviewsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListGroupCoachingSessionReviewsViewModel) => void,
        viewUtilities: TListGroupCoachingSessionReviewsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListGroupCoachingSessionReviewsUseCaseResponseSchema,
                viewModel: viewModels.ListGroupCoachingSessionReviewsViewModelSchema
            },
            middleware: ListGroupCoachingSessionReviewsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListGroupCoachingSessionReviewsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListGroupCoachingSessionReviewsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListGroupCoachingSessionReviewsErrorResponse,
            TListGroupCoachingSessionReviewsResponseMiddleware
        >,
    ): viewModels.TListGroupCoachingSessionReviewsViewModel {
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
