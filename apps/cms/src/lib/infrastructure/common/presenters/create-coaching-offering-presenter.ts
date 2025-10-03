import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateCoachingOfferingUseCaseResponseSchema,
    TCreateCoachingOfferingUseCaseResponse,
    TCreateCoachingOfferingErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCoachingOfferingPresenterUtilities = {};

export const CreateCoachingOfferingResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCoachingOfferingUseCaseResponse,
        viewModels.TCreateCoachingOfferingViewModel,
        TCreateCoachingOfferingPresenterUtilities
    >;

type TCreateCoachingOfferingResponseMiddleware = typeof CreateCoachingOfferingResponseMiddleware;

export default class CreateCoachingOfferingPresenter extends BasePresenter<
    TCreateCoachingOfferingUseCaseResponse,
    viewModels.TCreateCoachingOfferingViewModel,
    TCreateCoachingOfferingPresenterUtilities,
    TCreateCoachingOfferingResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCoachingOfferingViewModel) => void,
        viewUtilities: TCreateCoachingOfferingPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateCoachingOfferingUseCaseResponseSchema,
                viewModel: viewModels.CreateCoachingOfferingViewModelSchema
            },
            middleware: CreateCoachingOfferingResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateCoachingOfferingUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCoachingOfferingViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCoachingOfferingErrorResponse,
            TCreateCoachingOfferingResponseMiddleware
        >,
    ): viewModels.TCreateCoachingOfferingViewModel {
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
