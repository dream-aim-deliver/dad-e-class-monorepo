import { viewModels } from '@maany_shr/e-class-models';
import {
    SaveEmailConfigUseCaseResponseSchema,
    TSaveEmailConfigUseCaseResponse,
    TSaveEmailConfigErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveEmailConfigPresenterUtilities = {};

export const SaveEmailConfigResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveEmailConfigUseCaseResponse,
        viewModels.TSaveEmailConfigViewModel,
        TSaveEmailConfigPresenterUtilities
    >;

type TSaveEmailConfigResponseMiddleware = typeof SaveEmailConfigResponseMiddleware;

export default class SaveEmailConfigPresenter extends BasePresenter<
    TSaveEmailConfigUseCaseResponse,
    viewModels.TSaveEmailConfigViewModel,
    TSaveEmailConfigPresenterUtilities,
    TSaveEmailConfigResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSaveEmailConfigViewModel) => void,
        viewUtilities: TSaveEmailConfigPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveEmailConfigUseCaseResponseSchema,
                viewModel: viewModels.SaveEmailConfigViewModelSchema
            },
            middleware: SaveEmailConfigResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveEmailConfigUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSaveEmailConfigViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSaveEmailConfigErrorResponse,
            TSaveEmailConfigResponseMiddleware
        >,
    ): viewModels.TSaveEmailConfigViewModel {
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
