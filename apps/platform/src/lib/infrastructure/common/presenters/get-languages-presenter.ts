import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TLanguagesUtilities = {};

export const GetLanguagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetLanguagesUseCaseResponse,
        viewModels.TLanguageListViewModel,
        TLanguagesUtilities
    >;

type TGetLanguagesResponseMiddleware = typeof GetLanguagesResponseMiddleware;

export default class GetLanguagesPresenter extends BasePresenter<
    useCaseModels.TGetLanguagesUseCaseResponse,
    viewModels.TLanguageListViewModel,
    TLanguagesUtilities,
    TGetLanguagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TLanguageListViewModel) => void,
        viewUtilities: TLanguagesUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: GetLanguagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetLanguagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TLanguageListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetLanguagesUseCaseErrorResponse,
            TGetLanguagesResponseMiddleware
        >,
    ): viewModels.TLanguageListViewModel {
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
