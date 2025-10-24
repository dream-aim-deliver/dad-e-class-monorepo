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
export type TGetCoachingPagePresenterUtilities = {};

export const GetCoachingPageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCoachingPageUseCaseResponse,
        viewModels.TGetCoachingPageViewModel,
        TGetCoachingPagePresenterUtilities
    >;

type TGetCoachingPageResponseMiddleware =
    typeof GetCoachingPageResponseMiddleware;

export default class GetCoachingPagePresenter extends BasePresenter<
    TGetCoachingPageUseCaseResponse,
    viewModels.TGetCoachingPageViewModel,
    TGetCoachingPagePresenterUtilities,
    TGetCoachingPageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCoachingPageViewModel) => void,
        viewUtilities: TGetCoachingPagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCoachingPageUseCaseResponseSchema,
                viewModel: viewModels.GetCoachingPageViewModelSchema
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
    ): viewModels.TGetCoachingPageViewModel {
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
    ): viewModels.TGetCoachingPageViewModel {
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
