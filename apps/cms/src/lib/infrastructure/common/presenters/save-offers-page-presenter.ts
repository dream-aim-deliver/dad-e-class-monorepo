import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveOffersPageUseCaseResponseSchema,
    TSaveOffersPageUseCaseResponse,
    TSaveOffersPageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveOffersPagePresenterUtilities = {};

export const SaveOffersPageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveOffersPageUseCaseResponse,
        viewModels.TSaveOffersPageViewModel,
        TSaveOffersPagePresenterUtilities
    >;

type TSaveOffersPageResponseMiddleware = typeof SaveOffersPageResponseMiddleware;

export default class SaveOffersPagePresenter extends BasePresenter<
    TSaveOffersPageUseCaseResponse,
    viewModels.TSaveOffersPageViewModel,
    TSaveOffersPagePresenterUtilities,
    TSaveOffersPageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveOffersPageViewModel) => void,
        viewUtilities: TSaveOffersPagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveOffersPageUseCaseResponseSchema,
                viewModel: viewModels.SaveOffersPageViewModelSchema
            },
            middleware: SaveOffersPageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveOffersPageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveOffersPageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveOffersPageErrorResponse,
            TSaveOffersPageResponseMiddleware
        >,
    ): viewModels.TSaveOffersPageViewModel {
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
