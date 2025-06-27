import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TOffersPageOutlinePresenterUtilities = {
    redirect: (page: 'login') => Promise<void> | void;
};

export const GetOffersPageOutlineResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: ExtractStatusModel<
                    useCaseModels.TGetOffersPageOutlineUseCaseResponse,
                    false
                >;
                currentViewModel: viewModels.TOffersPageOutlineViewModel;
                setViewModel: (
                    currentViewModel: viewModels.TOffersPageOutlineViewModel,
                    viewModel: viewModels.TOffersPageOutlineViewModel,
                ) => void;
            },
            callback: TOffersPageOutlinePresenterUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies TBaseResponseResponseMiddleware<
    useCaseModels.TGetOffersPageOutlineUseCaseResponse,
    viewModels.TOffersPageOutlineViewModel,
    TOffersPageOutlinePresenterUtilities
>;

type TGetOffersPageOutlineResponseMiddleware =
    typeof GetOffersPageOutlineResponseMiddleware;

export default class OffersPageOutlinePresenter extends BasePresenter<
    useCaseModels.TGetOffersPageOutlineUseCaseResponse,
    viewModels.TOffersPageOutlineViewModel,
    TOffersPageOutlinePresenterUtilities,
    TGetOffersPageOutlineResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TOffersPageOutlineViewModel,
        ) => void,
        viewUtilities: TOffersPageOutlinePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetOffersPageOutlineUseCaseResponseSchema,
                viewModel: viewModels.OffersPageOutlineViewModelSchema,
            },
            middleware: GetOffersPageOutlineResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetOffersPageOutlineUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TOffersPageOutlineViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetOffersPageOutlineUseCaseErrorResponse,
            TGetOffersPageOutlineResponseMiddleware
        >,
    ): viewModels.TOffersPageOutlineViewModel {
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
