import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse,
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachingOfferingsPresenterUtilities = {};

export const ListCoachingOfferingsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCoachingOfferingsUseCaseResponse,
        viewModels.TCoachingOfferingListViewModel,
        TCoachingOfferingsPresenterUtilities
    >;

type TListCoachingOfferingsResponseMiddleware =
    typeof ListCoachingOfferingsResponseMiddleware;

export default class CoachingOfferingsPresenter extends BasePresenter<
    useCaseModels.TListCoachingOfferingsUseCaseResponse,
    viewModels.TCoachingOfferingListViewModel,
    TCoachingOfferingsPresenterUtilities,
    TListCoachingOfferingsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TCoachingOfferingListViewModel,
        ) => void,
        viewUtilities: TCoachingOfferingsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema,
            },
            middleware: ListCoachingOfferingsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel,
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCoachingOfferingsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachingOfferingListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data,
            },
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCoachingOfferingsUseCaseErrorResponse,
            TListCoachingOfferingsResponseMiddleware
        >,
    ): viewModels.TCoachingOfferingListViewModel {
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
