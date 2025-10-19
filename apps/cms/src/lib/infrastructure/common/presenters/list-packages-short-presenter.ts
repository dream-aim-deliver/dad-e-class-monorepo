import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPackagesShortUseCaseResponseSchema,
    TListPackagesShortUseCaseResponse,
    TListPackagesShortErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPackagesShortPresenterUtilities = {};

export const ListPackagesShortResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPackagesShortUseCaseResponse,
        viewModels.TListPackagesShortViewModel,
        TListPackagesShortPresenterUtilities
    >;

type TListPackagesShortResponseMiddleware = typeof ListPackagesShortResponseMiddleware;

export default class ListPackagesShortPresenter extends BasePresenter<
    TListPackagesShortUseCaseResponse,
    viewModels.TListPackagesShortViewModel,
    TListPackagesShortPresenterUtilities,
    TListPackagesShortResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPackagesShortViewModel) => void,
        viewUtilities: TListPackagesShortPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPackagesShortUseCaseResponseSchema,
                viewModel: viewModels.ListPackagesShortViewModelSchema
            },
            middleware: ListPackagesShortResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPackagesShortUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPackagesShortViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPackagesShortErrorResponse,
            TListPackagesShortResponseMiddleware
        >,
    ): viewModels.TListPackagesShortViewModel {
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
