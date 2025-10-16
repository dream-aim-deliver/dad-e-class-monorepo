import { viewModels } from '@maany_shr/e-class-models';
import {
    ListGroupCoachingSessionsUseCaseResponseSchema,
    TListGroupCoachingSessionsUseCaseResponse,
    TListGroupCoachingSessionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListGroupCoachingSessionsPresenterUtilities = {};

export const ListGroupCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListGroupCoachingSessionsUseCaseResponse,
        viewModels.TListGroupCoachingSessionsViewModel,
        TListGroupCoachingSessionsPresenterUtilities
    >;

type TListGroupCoachingSessionsResponseMiddleware = typeof ListGroupCoachingSessionsResponseMiddleware;

export default class ListGroupCoachingSessionsPresenter extends BasePresenter<
    TListGroupCoachingSessionsUseCaseResponse,
    viewModels.TListGroupCoachingSessionsViewModel,
    TListGroupCoachingSessionsPresenterUtilities,
    TListGroupCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListGroupCoachingSessionsViewModel) => void,
        viewUtilities: TListGroupCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListGroupCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.ListGroupCoachingSessionsViewModelSchema
            },
            middleware: ListGroupCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListGroupCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListGroupCoachingSessionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListGroupCoachingSessionsErrorResponse,
            TListGroupCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TListGroupCoachingSessionsViewModel {
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
