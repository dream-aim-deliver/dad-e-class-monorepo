import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateCoachingSessionReviewUseCaseResponseSchema,
    TCreateCoachingSessionReviewUseCaseResponse,
    TCreateCoachingSessionReviewErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCoachingSessionReviewPresenterUtilities = {};

export const CreateCoachingSessionReviewResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCoachingSessionReviewUseCaseResponse,
        viewModels.TCreateCoachingSessionReviewViewModel,
        TCreateCoachingSessionReviewPresenterUtilities
    >;

type TCreateCoachingSessionReviewResponseMiddleware = typeof CreateCoachingSessionReviewResponseMiddleware;

export default class CreateCoachingSessionReviewPresenter extends BasePresenter<
    TCreateCoachingSessionReviewUseCaseResponse,
    viewModels.TCreateCoachingSessionReviewViewModel,
    TCreateCoachingSessionReviewPresenterUtilities,
    TCreateCoachingSessionReviewResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCoachingSessionReviewViewModel) => void,
        viewUtilities: TCreateCoachingSessionReviewPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateCoachingSessionReviewUseCaseResponseSchema,
                viewModel: viewModels.CreateCoachingSessionReviewViewModelSchema
            },
            middleware: CreateCoachingSessionReviewResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateCoachingSessionReviewUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCoachingSessionReviewViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCoachingSessionReviewErrorResponse,
            TCreateCoachingSessionReviewResponseMiddleware
        >,
    ): viewModels.TCreateCoachingSessionReviewViewModel {
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