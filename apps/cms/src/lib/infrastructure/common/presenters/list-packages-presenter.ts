import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPackagesUseCaseResponseSchema,
    TListPackagesUseCaseResponse,
    TListPackagesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPackagesPresenterUtilities = {};

export const ListPackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPackagesUseCaseResponse,
        viewModels.TListPackagesViewModel,
        TListPackagesPresenterUtilities
    >;

type TListPackagesResponseMiddleware = typeof ListPackagesResponseMiddleware;

export default class ListPackagesPresenter extends BasePresenter<
    TListPackagesUseCaseResponse,
    viewModels.TListPackagesViewModel,
    TListPackagesPresenterUtilities,
    TListPackagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPackagesViewModel) => void,
        viewUtilities: TListPackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPackagesUseCaseResponseSchema,
                viewModel: viewModels.ListPackagesViewModelSchema
            },
            middleware: ListPackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPackagesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPackagesErrorResponse,
            TListPackagesResponseMiddleware
        >,
    ): viewModels.TListPackagesViewModel {
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
