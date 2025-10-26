import { viewModels } from '@maany_shr/e-class-models';
import {
    SavePlatformFooterUseCaseResponseSchema,
    TSavePlatformFooterUseCaseResponse,
    TSavePlatformFooterErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSavePlatformFooterPresenterUtilities = {};

export const SavePlatformFooterResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSavePlatformFooterUseCaseResponse,
        viewModels.TSavePlatformFooterViewModel,
        TSavePlatformFooterPresenterUtilities
    >;

type TSavePlatformFooterResponseMiddleware = typeof SavePlatformFooterResponseMiddleware;

export default class SavePlatformFooterPresenter extends BasePresenter<
    TSavePlatformFooterUseCaseResponse,
    viewModels.TSavePlatformFooterViewModel,
    TSavePlatformFooterPresenterUtilities,
    TSavePlatformFooterResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSavePlatformFooterViewModel) => void,
        viewUtilities: TSavePlatformFooterPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SavePlatformFooterUseCaseResponseSchema,
                viewModel: viewModels.SavePlatformFooterViewModelSchema
            },
            middleware: SavePlatformFooterResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSavePlatformFooterUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSavePlatformFooterViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSavePlatformFooterErrorResponse,
            TSavePlatformFooterResponseMiddleware
        >,
    ): viewModels.TSavePlatformFooterViewModel {
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
