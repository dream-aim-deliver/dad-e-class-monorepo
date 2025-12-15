import { viewModels } from '@maany_shr/e-class-models';
import {
    GetEmailConfigUseCaseResponseSchema,
    TGetEmailConfigUseCaseResponse,
    TGetEmailConfigErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetEmailConfigPresenterUtilities = {};

export const GetEmailConfigResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetEmailConfigUseCaseResponse,
        viewModels.TGetEmailConfigViewModel,
        TGetEmailConfigPresenterUtilities
    >;

type TGetEmailConfigResponseMiddleware = typeof GetEmailConfigResponseMiddleware;

export default class GetEmailConfigPresenter extends BasePresenter<
    TGetEmailConfigUseCaseResponse,
    viewModels.TGetEmailConfigViewModel,
    TGetEmailConfigPresenterUtilities,
    TGetEmailConfigResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetEmailConfigViewModel) => void,
        viewUtilities: TGetEmailConfigPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetEmailConfigUseCaseResponseSchema,
                viewModel: viewModels.GetEmailConfigViewModelSchema
            },
            middleware: GetEmailConfigResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetEmailConfigUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetEmailConfigViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetEmailConfigErrorResponse,
            TGetEmailConfigResponseMiddleware
        >,
    ): viewModels.TGetEmailConfigViewModel {
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
