import { viewModels } from '@maany_shr/e-class-models';
import {
    ListGroupMembersUseCaseResponseSchema,
    TListGroupMembersUseCaseResponse,
    TListGroupMembersErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListGroupMembersPresenterUtilities = {};

export const ListGroupMembersResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListGroupMembersUseCaseResponse,
        viewModels.TListGroupMembersViewModel,
        TListGroupMembersPresenterUtilities
    >;

type TListGroupMembersResponseMiddleware = typeof ListGroupMembersResponseMiddleware;

export default class ListGroupMembersPresenter extends BasePresenter<
    TListGroupMembersUseCaseResponse,
    viewModels.TListGroupMembersViewModel,
    TListGroupMembersPresenterUtilities,
    TListGroupMembersResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListGroupMembersViewModel) => void,
        viewUtilities: TListGroupMembersPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListGroupMembersUseCaseResponseSchema,
                viewModel: viewModels.ListGroupMembersViewModelSchema
            },
            middleware: ListGroupMembersResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListGroupMembersUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListGroupMembersViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListGroupMembersErrorResponse,
            TListGroupMembersResponseMiddleware
        >,
    ): viewModels.TListGroupMembersViewModel {
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
