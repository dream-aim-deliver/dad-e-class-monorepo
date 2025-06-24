import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

export type TOffersPagePackagesPresenterUtilities = {};

export const GetOffersPagePackagesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TGetOffersPagePackagesUseCaseResponse,
        viewModels.TOffersPagePackageListViewModel,
        TOffersPagePackagesPresenterUtilities
    >;

type TGetOffersPagePackagesResponseMiddleware =
    typeof GetOffersPagePackagesResponseMiddleware;

export default class OffersPagePackagesPresenter extends BasePresenter<
    useCaseModels.TGetOffersPagePackagesUseCaseResponse,
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
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: GetOffersPagePackagesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TGetOffersPagePackagesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TOffersPagePackageListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TGetOffersPagePackagesUseCaseErrorResponse,
            TGetOffersPagePackagesResponseMiddleware
        >,
    ): viewModels.TOffersPagePackageListViewModel {
        if (response.data.errorType === 'NotFound') {
            return {
                mode: 'not-found',
                data: {
                    type: response.data.errorType,
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context,
                    trace: undefined,
                },
            };
        }
        return {
            mode: 'kaboom',
            data: {
                type: response.data.errorType,
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context,
                trace: undefined,
            },
        };
    }
}
