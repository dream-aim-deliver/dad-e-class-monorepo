import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdateUserRolesUseCaseResponseSchema,
    TUpdateUserRolesUseCaseResponse,
    TUpdateUserRolesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdateUserRolesPresenterUtilities = {};

export const UpdateUserRolesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdateUserRolesUseCaseResponse,
        viewModels.TUpdateUserRolesViewModel,
        TUpdateUserRolesPresenterUtilities
    >;

type TUpdateUserRolesResponseMiddleware = typeof UpdateUserRolesResponseMiddleware;

export default class UpdateUserRolesPresenter extends BasePresenter<
    TUpdateUserRolesUseCaseResponse,
    viewModels.TUpdateUserRolesViewModel,
    TUpdateUserRolesPresenterUtilities,
    TUpdateUserRolesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdateUserRolesViewModel) => void,
        viewUtilities: TUpdateUserRolesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdateUserRolesUseCaseResponseSchema,
                viewModel: viewModels.UpdateUserRolesViewModelSchema
            },
            middleware: UpdateUserRolesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdateUserRolesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdateUserRolesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdateUserRolesErrorResponse,
            TUpdateUserRolesResponseMiddleware
        >,
    ): viewModels.TUpdateUserRolesViewModel {
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
