import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdateCoachingOfferingUseCaseResponseSchema,
    TUpdateCoachingOfferingUseCaseResponse,
    TUpdateCoachingOfferingErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdateCoachingOfferingPresenterUtilities = {};

export const UpdateCoachingOfferingResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdateCoachingOfferingUseCaseResponse,
        viewModels.TUpdateCoachingOfferingViewModel,
        TUpdateCoachingOfferingPresenterUtilities
    >;

type TUpdateCoachingOfferingResponseMiddleware = typeof UpdateCoachingOfferingResponseMiddleware;

export default class UpdateCoachingOfferingPresenter extends BasePresenter<
    TUpdateCoachingOfferingUseCaseResponse,
    viewModels.TUpdateCoachingOfferingViewModel,
    TUpdateCoachingOfferingPresenterUtilities,
    TUpdateCoachingOfferingResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdateCoachingOfferingViewModel) => void,
        viewUtilities: TUpdateCoachingOfferingPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdateCoachingOfferingUseCaseResponseSchema,
                viewModel: viewModels.UpdateCoachingOfferingViewModelSchema
            },
            middleware: UpdateCoachingOfferingResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdateCoachingOfferingUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdateCoachingOfferingViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdateCoachingOfferingErrorResponse,
            TUpdateCoachingOfferingResponseMiddleware
        >,
    ): viewModels.TUpdateCoachingOfferingViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
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
