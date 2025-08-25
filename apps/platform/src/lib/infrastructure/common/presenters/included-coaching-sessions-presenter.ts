import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TIncludedCoachingSessionsPresenterUtilities = {};

export const ListIncludedCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListIncludedCoachingSessionsUseCaseResponse,
        viewModels.TIncludedCoachingSessionListViewModel,
        TIncludedCoachingSessionsPresenterUtilities
    >;

type TListIncludedCoachingSessionsResponseMiddleware =
    typeof ListIncludedCoachingSessionsResponseMiddleware;

export default class IncludedCoachingSessionsPresenter extends BasePresenter<
    useCaseModels.TListIncludedCoachingSessionsUseCaseResponse,
    viewModels.TIncludedCoachingSessionListViewModel,
    TIncludedCoachingSessionsPresenterUtilities,
    TListIncludedCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TIncludedCoachingSessionListViewModel,
        ) => void,
        viewUtilities: TIncludedCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListIncludedCoachingSessionsUseCaseResponseSchema,
                viewModel:
                    viewModels.IncludedCoachingSessionListViewModelSchema
            },
            middleware: ListIncludedCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListIncludedCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TIncludedCoachingSessionListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListIncludedCoachingSessionsUseCaseErrorResponse,
            TListIncludedCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TIncludedCoachingSessionListViewModel {
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
