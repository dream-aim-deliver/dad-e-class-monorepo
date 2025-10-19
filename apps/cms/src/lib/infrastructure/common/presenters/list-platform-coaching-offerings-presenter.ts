import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPlatformCoachingOfferingsUseCaseResponseSchema,
    TListPlatformCoachingOfferingsUseCaseResponse,
    TListPlatformCoachingOfferingsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPlatformCoachingOfferingsPresenterUtilities = {};

export const ListPlatformCoachingOfferingsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPlatformCoachingOfferingsUseCaseResponse,
        viewModels.TListPlatformCoachingOfferingsViewModel,
        TListPlatformCoachingOfferingsPresenterUtilities
    >;

type TListPlatformCoachingOfferingsResponseMiddleware = typeof ListPlatformCoachingOfferingsResponseMiddleware;

export default class ListPlatformCoachingOfferingsPresenter extends BasePresenter<
    TListPlatformCoachingOfferingsUseCaseResponse,
    viewModels.TListPlatformCoachingOfferingsViewModel,
    TListPlatformCoachingOfferingsPresenterUtilities,
    TListPlatformCoachingOfferingsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPlatformCoachingOfferingsViewModel) => void,
        viewUtilities: TListPlatformCoachingOfferingsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPlatformCoachingOfferingsUseCaseResponseSchema,
                viewModel: viewModels.ListPlatformCoachingOfferingsViewModelSchema
            },
            middleware: ListPlatformCoachingOfferingsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPlatformCoachingOfferingsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPlatformCoachingOfferingsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPlatformCoachingOfferingsErrorResponse,
            TListPlatformCoachingOfferingsResponseMiddleware
        >,
    ): viewModels.TListPlatformCoachingOfferingsViewModel {
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
