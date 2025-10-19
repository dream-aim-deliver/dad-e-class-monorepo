import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPackageRelatedPackagesUseCaseResponseSchema,
    TListPackageRelatedPackagesUseCaseResponse,
    TListPackageRelatedPackagesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPackageRelatedPackagesPresenterUtilities = {};

export const ListPackageRelatedPackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPackageRelatedPackagesUseCaseResponse,
        viewModels.TListPackageRelatedPackagesViewModel,
        TListPackageRelatedPackagesPresenterUtilities
    >;

type TListPackageRelatedPackagesResponseMiddleware = typeof ListPackageRelatedPackagesResponseMiddleware;

export default class ListPackageRelatedPackagesPresenter extends BasePresenter<
    TListPackageRelatedPackagesUseCaseResponse,
    viewModels.TListPackageRelatedPackagesViewModel,
    TListPackageRelatedPackagesPresenterUtilities,
    TListPackageRelatedPackagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPackageRelatedPackagesViewModel) => void,
        viewUtilities: TListPackageRelatedPackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPackageRelatedPackagesUseCaseResponseSchema,
                viewModel: viewModels.ListPackageRelatedPackagesViewModelSchema
            },
            middleware: ListPackageRelatedPackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPackageRelatedPackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPackageRelatedPackagesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPackageRelatedPackagesErrorResponse,
            TListPackageRelatedPackagesResponseMiddleware
        >,
    ): viewModels.TListPackageRelatedPackagesViewModel {
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
