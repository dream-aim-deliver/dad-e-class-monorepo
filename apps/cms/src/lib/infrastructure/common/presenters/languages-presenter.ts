import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListLanguagesUseCaseResponse,
    ListLanguagesUseCaseResponseSchema,
    TListLanguagesErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TLanguagesPresenterUtilities = {};

export const ListLanguagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListLanguagesUseCaseResponse,
        viewModels.TLanguageListViewModel,
        TLanguagesPresenterUtilities
    >;

type TListLanguagesResponseMiddleware = typeof ListLanguagesResponseMiddleware;

export default class LanguagesPresenter extends BasePresenter<
    TListLanguagesUseCaseResponse,
    viewModels.TLanguageListViewModel,
    TLanguagesPresenterUtilities,
    TListLanguagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TLanguageListViewModel) => void,
        viewUtilities: TLanguagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListLanguagesUseCaseResponseSchema,
                viewModel: viewModels.LanguageListViewModelSchema
            },
            middleware: ListLanguagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListLanguagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TLanguageListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListLanguagesErrorResponse,
            TListLanguagesResponseMiddleware
        >,
    ): viewModels.TLanguageListViewModel {
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
