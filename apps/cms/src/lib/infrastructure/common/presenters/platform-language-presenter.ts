import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TPlatformLanguagePresenterUtilities = {};

export const GetPlatformLanguageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetPlatformLanguageUseCaseResponse,
        viewModels.TPlatformLanguageViewModel,
        TPlatformLanguagePresenterUtilities
    >;

type TGetPlatformLanguageResponseMiddleware =
    typeof GetPlatformLanguageResponseMiddleware;

export default class PlatformLanguagePresenter extends BasePresenter<
    useCaseModels.TGetPlatformLanguageUseCaseResponse,
    viewModels.TPlatformLanguageViewModel,
    TPlatformLanguagePresenterUtilities,
    TGetPlatformLanguageResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TPlatformLanguageViewModel,
        ) => void,
        viewUtilities: TPlatformLanguagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetPlatformLanguageUseCaseResponseSchema,
                viewModel: viewModels.PlatformLanguageViewModelSchema,
            },
            middleware: GetPlatformLanguageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetPlatformLanguageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TPlatformLanguageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetPlatformLanguageUseCaseErrorResponse,
            TGetPlatformLanguageResponseMiddleware
        >,
    ): viewModels.TPlatformLanguageViewModel {
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
            },
        };
    }
}
