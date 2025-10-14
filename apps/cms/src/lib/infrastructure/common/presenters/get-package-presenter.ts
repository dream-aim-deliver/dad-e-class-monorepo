import { viewModels } from '@maany_shr/e-class-models';
import {
    GetPackageUseCaseResponseSchema,
    TGetPackageUseCaseResponse,
    TGetPackageErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetPackagePresenterUtilities = {};

export const GetPackageResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetPackageUseCaseResponse,
        viewModels.TGetPackageViewModel,
        TGetPackagePresenterUtilities
    >;

type TGetPackageResponseMiddleware = typeof GetPackageResponseMiddleware;

export default class GetPackagePresenter extends BasePresenter<
    TGetPackageUseCaseResponse,
    viewModels.TGetPackageViewModel,
    TGetPackagePresenterUtilities,
    TGetPackageResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TGetPackageViewModel) => void,
        viewUtilities: TGetPackagePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetPackageUseCaseResponseSchema,
                viewModel: viewModels.GetPackageViewModelSchema
            },
            middleware: GetPackageResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetPackageUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TGetPackageViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TGetPackageErrorResponse,
            TGetPackageResponseMiddleware
        >,
    ): viewModels.TGetPackageViewModel {
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
