import { viewModels } from '@maany_shr/e-class-models';
import {
    RegisterCoachToGroupUseCaseResponseSchema,
    TRegisterCoachToGroupUseCaseResponse,
    TRegisterCoachToGroupErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TRegisterCoachToGroupPresenterUtilities = {};

export const RegisterCoachToGroupResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TRegisterCoachToGroupUseCaseResponse,
        viewModels.TRegisterCoachToGroupViewModel,
        TRegisterCoachToGroupPresenterUtilities
    >;

type TRegisterCoachToGroupResponseMiddleware = typeof RegisterCoachToGroupResponseMiddleware;

export default class RegisterCoachToGroupPresenter extends BasePresenter<
    TRegisterCoachToGroupUseCaseResponse,
    viewModels.TRegisterCoachToGroupViewModel,
    TRegisterCoachToGroupPresenterUtilities,
    TRegisterCoachToGroupResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TRegisterCoachToGroupViewModel) => void,
        viewUtilities: TRegisterCoachToGroupPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: RegisterCoachToGroupUseCaseResponseSchema,
                viewModel: viewModels.RegisterCoachToGroupViewModelSchema
            },
            middleware: RegisterCoachToGroupResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TRegisterCoachToGroupUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TRegisterCoachToGroupViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TRegisterCoachToGroupErrorResponse,
            TRegisterCoachToGroupResponseMiddleware
        >,
    ): viewModels.TRegisterCoachToGroupViewModel {
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
