import { viewModels } from '@maany_shr/e-class-models';
import {
    UpdatePackageUseCaseResponseSchema,
    TUpdatePackageUseCaseResponse,
    TUpdatePackageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TUpdatePackagePresenterUtilities = {};

export const UpdatePackageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TUpdatePackageUseCaseResponse,
        viewModels.TUpdatePackageViewModel,
        TUpdatePackagePresenterUtilities
    >;

type TUpdatePackageResponseMiddleware = typeof UpdatePackageResponseMiddleware;

export default class UpdatePackagePresenter extends BasePresenter<
    TUpdatePackageUseCaseResponse,
    viewModels.TUpdatePackageViewModel,
    TUpdatePackagePresenterUtilities,
    TUpdatePackageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TUpdatePackageViewModel) => void,
        viewUtilities: TUpdatePackagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: UpdatePackageUseCaseResponseSchema,
                viewModel: viewModels.UpdatePackageViewModelSchema
            },
            middleware: UpdatePackageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TUpdatePackageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TUpdatePackageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TUpdatePackageErrorResponse,
            TUpdatePackageResponseMiddleware
        >,
    ): viewModels.TUpdatePackageViewModel {
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
