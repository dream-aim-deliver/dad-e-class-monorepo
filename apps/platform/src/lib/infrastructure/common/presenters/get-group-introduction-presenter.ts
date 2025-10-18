import { viewModels } from '@maany_shr/e-class-models';
import {
    GetGroupIntroductionUseCaseResponseSchema,
    TGetGroupIntroductionUseCaseResponse,
    TGetGroupIntroductionErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetGroupIntroductionPresenterUtilities = {};

export const GetGroupIntroductionResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetGroupIntroductionUseCaseResponse,
        viewModels.TGetGroupIntroductionViewModel,
        TGetGroupIntroductionPresenterUtilities
    >;

type TGetGroupIntroductionResponseMiddleware = typeof GetGroupIntroductionResponseMiddleware;

export default class GetGroupIntroductionPresenter extends BasePresenter<
    TGetGroupIntroductionUseCaseResponse,
    viewModels.TGetGroupIntroductionViewModel,
    TGetGroupIntroductionPresenterUtilities,
    TGetGroupIntroductionResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetGroupIntroductionViewModel) => void,
        viewUtilities: TGetGroupIntroductionPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetGroupIntroductionUseCaseResponseSchema,
                viewModel: viewModels.GetGroupIntroductionViewModelSchema
            },
            middleware: GetGroupIntroductionResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetGroupIntroductionUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetGroupIntroductionViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetGroupIntroductionErrorResponse,
            TGetGroupIntroductionResponseMiddleware
        >,
    ): viewModels.TGetGroupIntroductionViewModel {
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
