import { viewModels } from '@maany_shr/e-class-models';
import {
    ListOffersPagePackagesUseCaseResponseSchema,
    TListOffersPagePackagesUseCaseResponse,
    TListOffersPagePackagesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListOffersPagePackagesPresenterUtilities = {};

export const ListOffersPagePackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListOffersPagePackagesUseCaseResponse,
        viewModels.TListOffersPagePackagesViewModel,
        TListOffersPagePackagesPresenterUtilities
    >;

type TListOffersPagePackagesResponseMiddleware = typeof ListOffersPagePackagesResponseMiddleware;

export default class ListOffersPagePackagesPresenter extends BasePresenter<
    TListOffersPagePackagesUseCaseResponse,
    viewModels.TListOffersPagePackagesViewModel,
    TListOffersPagePackagesPresenterUtilities,
    TListOffersPagePackagesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListOffersPagePackagesViewModel) => void,
        viewUtilities: TListOffersPagePackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListOffersPagePackagesUseCaseResponseSchema,
                viewModel: viewModels.ListOffersPagePackagesViewModelSchema
            },
            middleware: ListOffersPagePackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListOffersPagePackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListOffersPagePackagesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListOffersPagePackagesErrorResponse,
            TListOffersPagePackagesResponseMiddleware
        >,
    ): viewModels.TListOffersPagePackagesViewModel {
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
