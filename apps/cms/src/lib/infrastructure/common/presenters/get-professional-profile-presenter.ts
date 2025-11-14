import { viewModels } from '@maany_shr/e-class-models';
import {
    GetProfessionalProfileUseCaseResponseSchema,
    TGetProfessionalProfileUseCaseResponse,
    TGetProfessionalProfileErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetProfessionalProfilePresenterUtilities = {};

export const GetProfessionalProfileResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetProfessionalProfileUseCaseResponse,
        viewModels.TGetProfessionalProfileViewModel,
        TGetProfessionalProfilePresenterUtilities
    >;

type TGetProfessionalProfileResponseMiddleware = typeof GetProfessionalProfileResponseMiddleware;

export default class GetProfessionalProfilePresenter extends BasePresenter<
    TGetProfessionalProfileUseCaseResponse,
    viewModels.TGetProfessionalProfileViewModel,
    TGetProfessionalProfilePresenterUtilities,
    TGetProfessionalProfileResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetProfessionalProfileViewModel) => void,
        viewUtilities: TGetProfessionalProfilePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetProfessionalProfileUseCaseResponseSchema,
                viewModel: viewModels.GetProfessionalProfileViewModelSchema
            },
            middleware: GetProfessionalProfileResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetProfessionalProfileUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetProfessionalProfileViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetProfessionalProfileErrorResponse,
            TGetProfessionalProfileResponseMiddleware
        >,
    ): viewModels.TGetProfessionalProfileViewModel {
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
