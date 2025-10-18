import { viewModels } from '@maany_shr/e-class-models';
import {
    ListOffersPagePackagesShortUseCaseResponseSchema,
    TListOffersPagePackagesShortUseCaseResponse,
    TListOffersPagePackagesShortErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListOffersPagePackagesShortPresenterUtilities = {};

export const ListOffersPagePackagesShortResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListOffersPagePackagesShortUseCaseResponse,
        viewModels.TListOffersPagePackagesShortViewModel,
        TListOffersPagePackagesShortPresenterUtilities
    >;

type TListOffersPagePackagesShortResponseMiddleware = typeof ListOffersPagePackagesShortResponseMiddleware;

export default class ListOffersPagePackagesShortPresenter extends BasePresenter<
    TListOffersPagePackagesShortUseCaseResponse,
    viewModels.TListOffersPagePackagesShortViewModel,
    TListOffersPagePackagesShortPresenterUtilities,
    TListOffersPagePackagesShortResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListOffersPagePackagesShortViewModel) => void,
        viewUtilities: TListOffersPagePackagesShortPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListOffersPagePackagesShortUseCaseResponseSchema,
                viewModel: viewModels.ListOffersPagePackagesShortViewModelSchema
            },
            middleware: ListOffersPagePackagesShortResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListOffersPagePackagesShortUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListOffersPagePackagesShortViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListOffersPagePackagesShortErrorResponse,
            TListOffersPagePackagesShortResponseMiddleware
        >,
    ): viewModels.TListOffersPagePackagesShortViewModel {
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
