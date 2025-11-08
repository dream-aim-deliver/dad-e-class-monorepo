import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TListCoachingOfferingsUseCaseResponse,
    GetHomePageUseCaseResponseSchema,
    TListCoachingOfferingsErrorResponse
} from "@dream-aim-deliver/e-class-cms-rest";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachingOfferingsPresenterUtilities = {};

export const ListCoachingOfferingsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachingOfferingsUseCaseResponse,
        viewModels.TCoachingOfferingListViewModel,
        TCoachingOfferingsPresenterUtilities
    >;

type TListCoachingOfferingsResponseMiddleware =
    typeof ListCoachingOfferingsResponseMiddleware;

export default class CoachingOfferingsPresenter extends BasePresenter<
    TListCoachingOfferingsUseCaseResponse,
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
                responseModel: GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema
            },
            middleware: ListCoachingOfferingsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachingOfferingsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachingOfferingListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListCoachingOfferingsErrorResponse,
            TListCoachingOfferingsResponseMiddleware
        >,
    ): viewModels.TCoachingOfferingListViewModel {
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
