import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TOffersPageCarouselPresenterUtilities = {
    redirect: (page: 'login') => Promise<void> | void;
};

export const GetOffersPageCarouselResponseMiddleware = {
    'errorType:AuthenticationError': {
        redirect: async (
            context: {
                response: ExtractStatusModel<
                    useCaseModels.TGetOffersPageCarouselUseCaseResponse,
                    false
                >;
                currentViewModel: viewModels.TOffersPageCarouselViewModel;
                setViewModel: (
                    currentViewModel: viewModels.TOffersPageCarouselViewModel,
                    viewModel: viewModels.TOffersPageCarouselViewModel,
                ) => void;
            },
            callback: TOffersPageCarouselPresenterUtilities['redirect'],
        ) => {
            callback('login');
        },
    },
} satisfies TBaseResponseResponseMiddleware<
    useCaseModels.TGetOffersPageCarouselUseCaseResponse,
    viewModels.TOffersPageCarouselViewModel,
    TOffersPageCarouselPresenterUtilities
>;

type TGetOffersPageCarouselResponseMiddleware =
    typeof GetOffersPageCarouselResponseMiddleware;

export default class OffersPageCarouselPresenter extends BasePresenter<
    useCaseModels.TGetOffersPageCarouselUseCaseResponse,
    viewModels.TOffersPageCarouselViewModel,
    TOffersPageCarouselPresenterUtilities,
    TGetOffersPageCarouselResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TOffersPageCarouselViewModel,
        ) => void,
        viewUtilities: TOffersPageCarouselPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.GetOffersPageCarouselUseCaseResponseSchema,
                viewModel: viewModels.OffersPageCarouselViewModelSchema,
            },
            middleware: GetOffersPageCarouselResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetOffersPageCarouselUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TOffersPageCarouselViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetOffersPageCarouselUseCaseErrorResponse,
            TGetOffersPageCarouselResponseMiddleware
        >,
    ): viewModels.TOffersPageCarouselViewModel {
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
