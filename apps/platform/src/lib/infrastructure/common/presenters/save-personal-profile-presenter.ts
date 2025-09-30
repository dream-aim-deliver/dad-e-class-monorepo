import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TSavePersonalProfileUseCaseResponse,
    SavePersonalProfileUseCaseResponseSchema,
    TSavePersonalProfileErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSavePersonalProfilePresenterUtilities = {};

export const SavePersonalProfileResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSavePersonalProfileUseCaseResponse,
        viewModels.TSavePersonalProfileViewModel,
        TSavePersonalProfilePresenterUtilities
    >;

type TSavePersonalProfileResponseMiddleware = typeof SavePersonalProfileResponseMiddleware;

export default class SavePersonalProfilePresenter extends BasePresenter<
    TSavePersonalProfileUseCaseResponse,
    viewModels.TSavePersonalProfileViewModel,
    TSavePersonalProfilePresenterUtilities,
    TSavePersonalProfileResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSavePersonalProfileViewModel) => void,
        viewUtilities: TSavePersonalProfilePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SavePersonalProfileUseCaseResponseSchema,
                viewModel: viewModels.SavePersonalProfileViewModelSchema
            },
            middleware: SavePersonalProfileResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSavePersonalProfileUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSavePersonalProfileViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSavePersonalProfileErrorResponse,
            TSavePersonalProfileResponseMiddleware
        >,
    ): viewModels.TSavePersonalProfileViewModel {
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
