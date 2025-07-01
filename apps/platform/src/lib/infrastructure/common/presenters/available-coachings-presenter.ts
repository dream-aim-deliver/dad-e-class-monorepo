import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TAvailableCoachingsPresenterUtilities = {};

export const ListAvailableCoachingsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListAvailableCoachingsUseCaseResponse,
        viewModels.TAvailableCoachingListViewModel,
        TAvailableCoachingsPresenterUtilities
    >;

type TListAvailableCoachingsResponseMiddleware =
    typeof ListAvailableCoachingsResponseMiddleware;

export default class AvailableCoachingsPresenter extends BasePresenter<
    useCaseModels.TListAvailableCoachingsUseCaseResponse,
    viewModels.TAvailableCoachingListViewModel,
    TAvailableCoachingsPresenterUtilities,
    TListAvailableCoachingsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TAvailableCoachingListViewModel,
        ) => void,
        viewUtilities: TAvailableCoachingsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: ListAvailableCoachingsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListAvailableCoachingsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TAvailableCoachingListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListAvailableCoachingsUseCaseErrorResponse,
            TListAvailableCoachingsResponseMiddleware
        >,
    ): viewModels.TAvailableCoachingListViewModel {
        if (response.data.errorType === 'NotFound') {
            return {
                mode: 'not-found',
                data: {
                    type: response.data.errorType,
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    trace: undefined,
                },
            };
        }
        if (response.data.errorType === 'AuthenticationError') {
            return {
                mode: 'unauthenticated',
                data: {
                    type: response.data.errorType,
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    trace: undefined,
                },
            };
        }
        return {
            mode: 'kaboom',
            data: {
                type: response.data.errorType,
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
                trace: undefined,
            },
        };
    }
}
