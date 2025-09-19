import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachCoachingSessionsPresenterUtilities = {};

export const ListCoachCoachingSessionsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCoachCoachingSessionsUseCaseResponse,
        viewModels.TCoachCoachingSessionsViewModel,
        TCoachCoachingSessionsPresenterUtilities
    >;

type TListCoachCoachingSessionsResponseMiddleware =
    typeof ListCoachCoachingSessionsResponseMiddleware;

export default class CoachCoachingSessionsPresenter extends BasePresenter<
    useCaseModels.TListCoachCoachingSessionsUseCaseResponse,
    viewModels.TCoachCoachingSessionsViewModel,
    TCoachCoachingSessionsPresenterUtilities,
    TListCoachCoachingSessionsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCoachCoachingSessionsViewModel,
        ) => void,
        viewUtilities: TCoachCoachingSessionsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.ListCoachCoachingSessionsUseCaseResponseSchema,
                viewModel: viewModels.CoachCoachingSessionsViewModelSchema
            },
            middleware: ListCoachCoachingSessionsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCoachCoachingSessionsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachCoachingSessionsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCoachCoachingSessionsUseCaseErrorResponse,
            TListCoachCoachingSessionsResponseMiddleware
        >,
    ): viewModels.TCoachCoachingSessionsViewModel {
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
