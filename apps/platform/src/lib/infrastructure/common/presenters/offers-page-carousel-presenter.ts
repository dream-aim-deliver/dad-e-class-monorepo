import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    ExtractStatusModel,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TOffersPageCarouselPresenterUtilities = {};

export const GetOffersPageCarouselResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
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
                viewModel: viewModels.OffersPageCarouselViewModelSchema
            },
            middleware: GetOffersPageCarouselResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
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
                ...response.data
            }
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

                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context

            }
        };
    }
}
