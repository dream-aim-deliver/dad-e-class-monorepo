import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TOffersPagePackagesPresenterUtilities = {};

export const ListOffersPagePackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListOffersPagePackagesUseCaseResponse,
        viewModels.TOffersPagePackageListViewModel,
        TOffersPagePackagesPresenterUtilities
    >;

type TGetOffersPagePackagesResponseMiddleware =
    typeof ListOffersPagePackagesResponseMiddleware;

export default class OffersPagePackagesPresenter extends BasePresenter<
    useCaseModels.TListOffersPagePackagesUseCaseResponse,
    viewModels.TOffersPagePackageListViewModel,
    TOffersPagePackagesPresenterUtilities,
    TGetOffersPagePackagesResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TOffersPagePackageListViewModel,
        ) => void,
        viewUtilities: TOffersPagePackagesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema
            },
            middleware: ListOffersPagePackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListOffersPagePackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TOffersPagePackageListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListOffersPagePackagesUseCaseErrorResponse,
            TGetOffersPagePackagesResponseMiddleware
        >,
    ): viewModels.TOffersPagePackageListViewModel {
        if (response.data.errorType === 'NotFound') {
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
