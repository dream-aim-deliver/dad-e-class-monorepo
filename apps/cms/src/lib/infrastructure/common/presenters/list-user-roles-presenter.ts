import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUserRolesUseCaseResponseSchema,
    TListUserRolesUseCaseResponse,
    TListUserRolesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUserRolesPresenterUtilities = {};

export const ListUserRolesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUserRolesUseCaseResponse,
        viewModels.TListUserRolesViewModel,
        TListUserRolesPresenterUtilities
    >;

type TListUserRolesResponseMiddleware = typeof ListUserRolesResponseMiddleware;

export default class ListUserRolesPresenter extends BasePresenter<
    TListUserRolesUseCaseResponse,
    viewModels.TListUserRolesViewModel,
    TListUserRolesPresenterUtilities,
    TListUserRolesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUserRolesViewModel) => void,
        viewUtilities: TListUserRolesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUserRolesUseCaseResponseSchema,
                viewModel: viewModels.ListUserRolesViewModelSchema
            },
            middleware: ListUserRolesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUserRolesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUserRolesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUserRolesErrorResponse,
            TListUserRolesResponseMiddleware
        >,
    ): viewModels.TListUserRolesViewModel {
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
