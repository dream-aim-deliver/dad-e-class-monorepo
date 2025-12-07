import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachCoachingSessionsUseCaseResponseSchema,
    TListCoachCoachingSessionsUseCaseResponse,
    TListCoachCoachingSessionsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachCoachingSessionsPresenterUtilities = {};

export const ListCoachCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachCoachingSessionsUseCaseResponse,
        viewModels.TListCoachCoachingSessionsViewModel,
        TListCoachCoachingSessionsPresenterUtilities
    >;

type TListCoachCoachingSessionsResponseMiddleware = typeof ListCoachCoachingSessionsResponseMiddleware;

export default class ListCoachCoachingSessionsPresenter extends BasePresenter<
    TListCoachCoachingSessionsUseCaseResponse,
    viewModels.TListCoachCoachingSessionsViewModel,
    TListCoachCoachingSessionsPresenterUtilities,
    TListCoachCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachCoachingSessionsViewModel) => void,
        viewUtilities: TListCoachCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.ListCoachCoachingSessionsViewModelSchema
            },
            middleware: ListCoachCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCoachCoachingSessionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachCoachingSessionsErrorResponse,
            TListCoachCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TListCoachCoachingSessionsViewModel {
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
