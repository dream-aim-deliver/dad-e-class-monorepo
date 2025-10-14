import { viewModels } from '@maany_shr/e-class-models';
import {
    CreatePackageUseCaseResponseSchema,
    TCreatePackageUseCaseResponse,
    TCreatePackageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCreatePackagePresenterUtilities = {};

export const CreatePackageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TCreatePackageUseCaseResponse,
        viewModels.TCreatePackageViewModel,
        TCreatePackagePresenterUtilities
    >;

type TCreatePackageResponseMiddleware = typeof CreatePackageResponseMiddleware;

export default class CreatePackagePresenter extends BasePresenter<
    TCreatePackageUseCaseResponse,
    viewModels.TCreatePackageViewModel,
    TCreatePackagePresenterUtilities,
    TCreatePackageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCreatePackageViewModel) => void,
        viewUtilities: TCreatePackagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: CreatePackageUseCaseResponseSchema,
                viewModel: viewModels.CreatePackageViewModelSchema
            },
            middleware: CreatePackageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TCreatePackageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCreatePackageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TCreatePackageErrorResponse,
            TCreatePackageResponseMiddleware
        >,
    ): viewModels.TCreatePackageViewModel {
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
