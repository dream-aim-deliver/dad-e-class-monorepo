import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TSaveProfessionalProfileUseCaseResponse,
    SaveProfessionalProfileUseCaseResponseSchema,
    TSaveProfessionalProfileErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveProfessionalProfilePresenterUtilities = {};

export const SaveProfessionalProfileResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveProfessionalProfileUseCaseResponse,
        viewModels.TSaveProfessionalProfileViewModel,
        TSaveProfessionalProfilePresenterUtilities
    >;

type TSaveProfessionalProfileResponseMiddleware = typeof SaveProfessionalProfileResponseMiddleware;

export default class SaveProfessionalProfilePresenter extends BasePresenter<
    TSaveProfessionalProfileUseCaseResponse,
    viewModels.TSaveProfessionalProfileViewModel,
    TSaveProfessionalProfilePresenterUtilities,
    TSaveProfessionalProfileResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveProfessionalProfileViewModel) => void,
        viewUtilities: TSaveProfessionalProfilePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveProfessionalProfileUseCaseResponseSchema,
                viewModel: viewModels.SaveProfessionalProfileViewModelSchema
            },
            middleware: SaveProfessionalProfileResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveProfessionalProfileUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveProfessionalProfileViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveProfessionalProfileErrorResponse,
            TSaveProfessionalProfileResponseMiddleware
        >,
    ): viewModels.TSaveProfessionalProfileViewModel {
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
