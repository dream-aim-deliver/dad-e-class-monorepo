import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachingSessionsUseCaseResponseSchema,
    TListCoachingSessionsUseCaseResponse,
    TListCoachingSessionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachingSessionsPresenterUtilities = {};

export const ListCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachingSessionsUseCaseResponse,
        viewModels.TListCoachingSessionsViewModel,
        TListCoachingSessionsPresenterUtilities
    >;

type TListCoachingSessionsResponseMiddleware = typeof ListCoachingSessionsResponseMiddleware;

export default class ListCoachingSessionsPresenter extends BasePresenter<
    TListCoachingSessionsUseCaseResponse,
    viewModels.TListCoachingSessionsViewModel,
    TListCoachingSessionsPresenterUtilities,
    TListCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachingSessionsViewModel) => void,
        viewUtilities: TListCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.ListCoachingSessionsViewModelSchema
            },
            middleware: ListCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCoachingSessionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachingSessionsErrorResponse,
            TListCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TListCoachingSessionsViewModel {
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
