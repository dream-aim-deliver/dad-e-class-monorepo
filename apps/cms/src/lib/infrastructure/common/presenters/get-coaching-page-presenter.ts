import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    GetCoachingPageUseCaseResponseSchema,
    TGetCoachingPageUseCaseResponse,
    TGetCoachingPageErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachingPagePresenterUtilities = {};

export const GetCoachingPageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCoachingPageUseCaseResponse,
        viewModels.TCoachingPageViewModel,
        TCoachingPagePresenterUtilities
    >;

type TGetCoachingPageResponseMiddleware =
    typeof GetCoachingPageResponseMiddleware;

export default class GetCoachingPagePresenter extends BasePresenter<
    TGetCoachingPageUseCaseResponse,
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
                responseModel: GetCoachingPageUseCaseResponseSchema,
                viewModel: viewModels.CoachingPageViewModelSchema
            },
            middleware: GetCoachingPageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCoachingPageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachingPageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TGetCoachingPageErrorResponse,
            TGetCoachingPageResponseMiddleware
        >,
    ): viewModels.TCoachingPageViewModel {
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
