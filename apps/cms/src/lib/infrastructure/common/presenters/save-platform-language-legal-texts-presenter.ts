import { viewModels } from '@maany_shr/e-class-models';
import {
    SavePlatformLanguageLegalTextsUseCaseResponseSchema,
    TSavePlatformLanguageLegalTextsUseCaseResponse,
    TSavePlatformLanguageLegalTextsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSavePlatformLanguageLegalTextsPresenterUtilities = {};

export const SavePlatformLanguageLegalTextsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSavePlatformLanguageLegalTextsUseCaseResponse,
        viewModels.TSavePlatformLanguageLegalTextsViewModel,
        TSavePlatformLanguageLegalTextsPresenterUtilities
    >;

type TSavePlatformLanguageLegalTextsResponseMiddleware = typeof SavePlatformLanguageLegalTextsResponseMiddleware;

export default class SavePlatformLanguageLegalTextsPresenter extends BasePresenter<
    TSavePlatformLanguageLegalTextsUseCaseResponse,
    viewModels.TSavePlatformLanguageLegalTextsViewModel,
    TSavePlatformLanguageLegalTextsPresenterUtilities,
    TSavePlatformLanguageLegalTextsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TSavePlatformLanguageLegalTextsViewModel) => void,
        viewUtilities: TSavePlatformLanguageLegalTextsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SavePlatformLanguageLegalTextsUseCaseResponseSchema,
                viewModel: viewModels.SavePlatformLanguageLegalTextsViewModelSchema
            },
            middleware: SavePlatformLanguageLegalTextsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSavePlatformLanguageLegalTextsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TSavePlatformLanguageLegalTextsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TSavePlatformLanguageLegalTextsErrorResponse,
            TSavePlatformLanguageLegalTextsResponseMiddleware
        >,
    ): viewModels.TSavePlatformLanguageLegalTextsViewModel {
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
