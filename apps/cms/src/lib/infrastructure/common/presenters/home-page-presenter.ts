import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type THomePagePresenterUtilities = {};

export const GetHomePageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetHomePageUseCaseResponse,
        viewModels.THomePageViewModel,
        THomePagePresenterUtilities
    >;

type TGetHomePageResponseMiddleware = typeof GetHomePageResponseMiddleware;

export default class HomePagePresenter extends BasePresenter<
    useCaseModels.TGetHomePageUseCaseResponse,
    viewModels.THomePageViewModel,
    THomePagePresenterUtilities,
    TGetHomePageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.THomePageViewModel) => void,
        viewUtilities: THomePagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema
            },
            middleware: GetHomePageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetHomePageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.THomePageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetHomePageUseCaseErrorResponse,
            TGetHomePageResponseMiddleware
        >,
    ): viewModels.THomePageViewModel {
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
