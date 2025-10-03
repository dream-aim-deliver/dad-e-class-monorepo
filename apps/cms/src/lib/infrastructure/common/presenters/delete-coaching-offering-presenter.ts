import { viewModels } from '@maany_shr/e-class-models';
import {
    DeleteCoachingOfferingResponseSchema,
    TDeleteCoachingOfferingResponse,
    TDeleteCoachingOfferingErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDeleteCoachingOfferingPresenterUtilities = {};

export const DeleteCoachingOfferingResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDeleteCoachingOfferingResponse,
        viewModels.TDeleteCoachingOfferingViewModel,
        TDeleteCoachingOfferingPresenterUtilities
    >;

type TDeleteCoachingOfferingResponseMiddleware = typeof DeleteCoachingOfferingResponseMiddleware;

export default class DeleteCoachingOfferingPresenter extends BasePresenter<
    TDeleteCoachingOfferingResponse,
    viewModels.TDeleteCoachingOfferingViewModel,
    TDeleteCoachingOfferingPresenterUtilities,
    TDeleteCoachingOfferingResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDeleteCoachingOfferingViewModel) => void,
        viewUtilities: TDeleteCoachingOfferingPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DeleteCoachingOfferingResponseSchema,
                viewModel: viewModels.DeleteCoachingOfferingViewModelSchema
            },
            middleware: DeleteCoachingOfferingResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDeleteCoachingOfferingResponse,
            { success: true }
        >,
    ): viewModels.TDeleteCoachingOfferingViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDeleteCoachingOfferingErrorResponse,
            TDeleteCoachingOfferingResponseMiddleware
        >,
    ): viewModels.TDeleteCoachingOfferingViewModel {
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
