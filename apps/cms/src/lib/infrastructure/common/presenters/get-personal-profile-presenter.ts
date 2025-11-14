import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPersonalProfileUseCaseResponseSchema,
    TGetPersonalProfileUseCaseResponse,
    TGetPersonalProfileErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPersonalProfilePresenterUtilities = {};

export const GetPersonalProfileResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPersonalProfileUseCaseResponse,
        viewModels.TGetPersonalProfileViewModel,
        TGetPersonalProfilePresenterUtilities
    >;

type TGetPersonalProfileResponseMiddleware = typeof GetPersonalProfileResponseMiddleware;

export default class GetPersonalProfilePresenter extends BasePresenter<
    TGetPersonalProfileUseCaseResponse,
    viewModels.TGetPersonalProfileViewModel,
    TGetPersonalProfilePresenterUtilities,
    TGetPersonalProfileResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPersonalProfileViewModel) => void,
        viewUtilities: TGetPersonalProfilePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPersonalProfileUseCaseResponseSchema,
                viewModel: viewModels.GetPersonalProfileViewModelSchema
            },
            middleware: GetPersonalProfileResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPersonalProfileUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetPersonalProfileViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPersonalProfileErrorResponse,
            TGetPersonalProfileResponseMiddleware
        >,
    ): viewModels.TGetPersonalProfileViewModel {
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
