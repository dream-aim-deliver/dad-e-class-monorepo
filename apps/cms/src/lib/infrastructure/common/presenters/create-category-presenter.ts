import { viewModels } from '@maany_shr/e-class-models';
import {
    CreateCategoryUseCaseResponseSchema,
    TCreateCategoryUseCaseResponse,
    TCreateCategoryErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreateCategoryPresenterUtilities = {};

export const CreateCategoryResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreateCategoryUseCaseResponse,
        viewModels.TCreateCategoryViewModel,
        TCreateCategoryPresenterUtilities
    >;

type TCreateCategoryResponseMiddleware = typeof CreateCategoryResponseMiddleware;

export default class CreateCategoryPresenter extends BasePresenter<
    TCreateCategoryUseCaseResponse,
    viewModels.TCreateCategoryViewModel,
    TCreateCategoryPresenterUtilities,
    TCreateCategoryResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreateCategoryViewModel) => void,
        viewUtilities: TCreateCategoryPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreateCategoryUseCaseResponseSchema,
                viewModel: viewModels.CreateCategoryViewModelSchema
            },
            middleware: CreateCategoryResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreateCategoryUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreateCategoryViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreateCategoryErrorResponse,
            TCreateCategoryResponseMiddleware
        >,
    ): viewModels.TCreateCategoryViewModel {
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
