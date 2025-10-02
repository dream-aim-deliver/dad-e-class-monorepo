import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCoachingSessionReviewPresenterUtilities = {};

export const CreateCoachingSessionReviewResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TCreateCoachingSessionReviewUseCaseResponse,
        viewModels.TCreateCoachingSessionReviewViewModel,
        TCreateCoachingSessionReviewPresenterUtilities
    >;

type TCreateCoachingSessionReviewResponseMiddleware = typeof CreateCoachingSessionReviewResponseMiddleware;

export default class CreateCoachingSessionReviewPresenter extends BasePresenter<
    useCaseModels.TCreateCoachingSessionReviewUseCaseResponse,
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
                responseModel: useCaseModels.CreateCoachingSessionReviewUseCaseResponseSchema,
                viewModel: viewModels.CreateCoachingSessionReviewViewModelSchema
            },
            middleware: CreateCoachingSessionReviewResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TCreateCoachingSessionReviewUseCaseResponse,
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
            useCaseModels.TCreateCoachingSessionReviewUseCaseErrorResponse,
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