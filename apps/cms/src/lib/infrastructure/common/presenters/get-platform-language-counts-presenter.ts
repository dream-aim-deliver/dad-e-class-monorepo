import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPlatformLanguageCountsResponseSchema,
    TGetPlatformLanguageCountsResponse,
    TGetPlatformLanguageCountsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPlatformLanguageCountsPresenterUtilities = {};

export const GetPlatformLanguageCountsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPlatformLanguageCountsResponse,
        viewModels.TGetPlatformLanguageCountsViewModel,
        TGetPlatformLanguageCountsPresenterUtilities
    >;

type TGetPlatformLanguageCountsResponseMiddleware = typeof GetPlatformLanguageCountsResponseMiddleware;

export default class GetPlatformLanguageCountsPresenter extends BasePresenter<
    TGetPlatformLanguageCountsResponse,
    viewModels.TGetPlatformLanguageCountsViewModel,
    TGetPlatformLanguageCountsPresenterUtilities,
    TGetPlatformLanguageCountsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPlatformLanguageCountsViewModel) => void,
        viewUtilities: TGetPlatformLanguageCountsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPlatformLanguageCountsResponseSchema,
                viewModel: viewModels.GetPlatformLanguageCountsViewModelSchema
            },
            middleware: GetPlatformLanguageCountsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPlatformLanguageCountsResponse,
            { success: true }
        >,
    ): viewModels.TGetPlatformLanguageCountsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPlatformLanguageCountsErrorResponse,
            TGetPlatformLanguageCountsResponseMiddleware
        >,
    ): viewModels.TGetPlatformLanguageCountsViewModel {
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
