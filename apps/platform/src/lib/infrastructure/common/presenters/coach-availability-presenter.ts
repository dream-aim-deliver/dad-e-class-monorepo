import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachAvailabilityPresenterUtilities = {};

export const GetCoachAvailabilityResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetCoachAvailabilityUseCaseResponse,
        viewModels.TCoachAvailabilityViewModel,
        TCoachAvailabilityPresenterUtilities
    >;

type TGetCoachAvailabilityResponseMiddleware =
    typeof GetCoachAvailabilityResponseMiddleware;

export default class CoachAvailabilityPresenter extends BasePresenter<
    useCaseModels.TGetCoachAvailabilityUseCaseResponse,
    viewModels.TCoachAvailabilityViewModel,
    TCoachAvailabilityPresenterUtilities,
    TGetCoachAvailabilityResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCoachAvailabilityViewModel,
        ) => void,
        viewUtilities: TCoachAvailabilityPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetCoachAvailabilityUseCaseResponseSchema,
                viewModel: viewModels.CoachAvailabilityViewModelSchema,
            },
            middleware: GetCoachAvailabilityResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetCoachAvailabilityUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachAvailabilityViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetCoachAvailabilityUseCaseErrorResponse,
            TGetCoachAvailabilityResponseMiddleware
        >,
    ): viewModels.TCoachAvailabilityViewModel {
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                },
            };
        }
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
            },
        };
    }
}
