import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUsersUseCaseResponseSchema,
    TListUsersUseCaseResponse,
    TListUsersErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUsersPresenterUtilities = {};

export const ListUsersResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUsersUseCaseResponse,
        viewModels.TListUsersViewModel,
        TListUsersPresenterUtilities
    >;

type TListUsersResponseMiddleware = typeof ListUsersResponseMiddleware;

export default class ListUsersPresenter extends BasePresenter<
    TListUsersUseCaseResponse,
    viewModels.TListUsersViewModel,
    TListUsersPresenterUtilities,
    TListUsersResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUsersViewModel) => void,
        viewUtilities: TListUsersPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUsersUseCaseResponseSchema,
                viewModel: viewModels.ListUsersViewModelSchema
            },
            middleware: ListUsersResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUsersUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUsersViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUsersErrorResponse,
            TListUsersResponseMiddleware
        >,
    ): viewModels.TListUsersViewModel {
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
