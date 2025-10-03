import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdateCategoryUseCaseResponseSchema,
    TUpdateCategoryUseCaseResponse,
    TUpdateCategoryErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdateCategoryPresenterUtilities = {};

export const UpdateCategoryResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdateCategoryUseCaseResponse,
        viewModels.TUpdateCategoryViewModel,
        TUpdateCategoryPresenterUtilities
    >;

type TUpdateCategoryResponseMiddleware = typeof UpdateCategoryResponseMiddleware;

export default class UpdateCategoryPresenter extends BasePresenter<
    TUpdateCategoryUseCaseResponse,
    viewModels.TUpdateCategoryViewModel,
    TUpdateCategoryPresenterUtilities,
    TUpdateCategoryResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdateCategoryViewModel) => void,
        viewUtilities: TUpdateCategoryPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdateCategoryUseCaseResponseSchema,
                viewModel: viewModels.UpdateCategoryViewModelSchema
            },
            middleware: UpdateCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdateCategoryUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdateCategoryViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdateCategoryErrorResponse,
            TUpdateCategoryResponseMiddleware
        >,
    ): viewModels.TUpdateCategoryViewModel {
        if (response.data.errorType === 'ValidationError') {
            return {
                mode: 'invalid',
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
