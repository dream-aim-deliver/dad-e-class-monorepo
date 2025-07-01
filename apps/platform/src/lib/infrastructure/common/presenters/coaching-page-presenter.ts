import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachingPagePresenterUtilities = {};

export const GetCoachingPageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCoachingPageUseCaseResponse,
        viewModels.TCoachingPageViewModel,
        TCoachingPagePresenterUtilities
    >;

type TGetCoachingPageResponseMiddleware =
    typeof GetCoachingPageResponseMiddleware;

export default class CoachingPagePresenter extends BasePresenter<
    useCaseModels.TGetCoachingPageUseCaseResponse,
    viewModels.TCoachingPageViewModel,
    TCoachingPagePresenterUtilities,
    TGetCoachingPageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCoachingPageViewModel) => void,
        viewUtilities: TCoachingPagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCoachingPageUseCaseResponseSchema,
                viewModel: viewModels.CoachingPageViewModelSchema,
            },
            middleware: GetCoachingPageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCoachingPageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachingPageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCoachingPageUseCaseErrorResponse,
            TGetCoachingPageResponseMiddleware
        >,
    ): viewModels.TCoachingPageViewModel {
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
