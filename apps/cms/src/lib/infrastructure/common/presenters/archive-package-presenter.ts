import { viewModels } from '@maany_shr/e-class-models';
import {
    ArchivePackageUseCaseResponseSchema,
    TArchivePackageUseCaseResponse,
    TArchivePackageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TArchivePackagePresenterUtilities = {};

export const ArchivePackageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TArchivePackageUseCaseResponse,
        viewModels.TArchivePackageViewModel,
        TArchivePackagePresenterUtilities
    >;

type TArchivePackageResponseMiddleware = typeof ArchivePackageResponseMiddleware;

export default class ArchivePackagePresenter extends BasePresenter<
    TArchivePackageUseCaseResponse,
    viewModels.TArchivePackageViewModel,
    TArchivePackagePresenterUtilities,
    TArchivePackageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TArchivePackageViewModel) => void,
        viewUtilities: TArchivePackagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ArchivePackageUseCaseResponseSchema,
                viewModel: viewModels.ArchivePackageViewModelSchema
            },
            middleware: ArchivePackageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TArchivePackageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TArchivePackageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TArchivePackageErrorResponse,
            TArchivePackageResponseMiddleware
        >,
    ): viewModels.TArchivePackageViewModel {
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
