import { viewModels } from '@maany_shr/e-class-models';
import {
    DeleteCategoryUseCaseResponseSchema,
    TDeleteCategoryUseCaseResponse,
    TDeleteCategoryErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TDeleteCategoryPresenterUtilities = {};

export const DeleteCategoryResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TDeleteCategoryUseCaseResponse,
        viewModels.TDeleteCategoryViewModel,
        TDeleteCategoryPresenterUtilities
    >;

type TDeleteCategoryResponseMiddleware = typeof DeleteCategoryResponseMiddleware;

export default class DeleteCategoryPresenter extends BasePresenter<
    TDeleteCategoryUseCaseResponse,
    viewModels.TDeleteCategoryViewModel,
    TDeleteCategoryPresenterUtilities,
    TDeleteCategoryResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TDeleteCategoryViewModel) => void,
        viewUtilities: TDeleteCategoryPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: DeleteCategoryUseCaseResponseSchema,
                viewModel: viewModels.DeleteCategoryViewModelSchema
            },
            middleware: DeleteCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TDeleteCategoryUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TDeleteCategoryViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TDeleteCategoryErrorResponse,
            TDeleteCategoryResponseMiddleware
        >,
    ): viewModels.TDeleteCategoryViewModel {
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
