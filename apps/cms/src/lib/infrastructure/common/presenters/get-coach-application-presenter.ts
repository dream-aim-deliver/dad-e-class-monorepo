import { viewModels } from '@maany_shr/e-class-models';
import {
    GetCoachApplicationUseCaseResponseSchema,
    TGetCoachApplicationUseCaseResponse,
    TGetCoachApplicationErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetCoachApplicationPresenterUtilities = {};

export const GetCoachApplicationResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetCoachApplicationUseCaseResponse,
        viewModels.TGetCoachApplicationViewModel,
        TGetCoachApplicationPresenterUtilities
    >;

type TGetCoachApplicationResponseMiddleware = typeof GetCoachApplicationResponseMiddleware;

export default class GetCoachApplicationPresenter extends BasePresenter<
    TGetCoachApplicationUseCaseResponse,
    viewModels.TGetCoachApplicationViewModel,
    TGetCoachApplicationPresenterUtilities,
    TGetCoachApplicationResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetCoachApplicationViewModel) => void,
        viewUtilities: TGetCoachApplicationPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetCoachApplicationUseCaseResponseSchema,
                viewModel: viewModels.GetCoachApplicationViewModelSchema
            },
            middleware: GetCoachApplicationResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetCoachApplicationUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetCoachApplicationViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetCoachApplicationErrorResponse,
            TGetCoachApplicationResponseMiddleware
        >,
    ): viewModels.TGetCoachApplicationViewModel {
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
