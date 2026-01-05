import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCourseCoachingSessionPurchaseStatusPresenterUtilities = {};

export const ListCourseCoachingSessionPurchaseStatusResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCourseCoachingSessionPurchaseStatusUseCaseResponse,
        viewModels.TListCourseCoachingSessionPurchaseStatusViewModel,
        TListCourseCoachingSessionPurchaseStatusPresenterUtilities
    >;

type TListCourseCoachingSessionPurchaseStatusResponseMiddleware =
    typeof ListCourseCoachingSessionPurchaseStatusResponseMiddleware;

export default class ListCourseCoachingSessionPurchaseStatusPresenter extends BasePresenter<
    useCaseModels.TListCourseCoachingSessionPurchaseStatusUseCaseResponse,
    viewModels.TListCourseCoachingSessionPurchaseStatusViewModel,
    TListCourseCoachingSessionPurchaseStatusPresenterUtilities,
    TListCourseCoachingSessionPurchaseStatusResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TListCourseCoachingSessionPurchaseStatusViewModel,
        ) => void,
        viewUtilities: TListCourseCoachingSessionPurchaseStatusPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListCourseCoachingSessionPurchaseStatusUseCaseResponseSchema,
                viewModel:
                    viewModels.ListCourseCoachingSessionPurchaseStatusViewModelSchema
            },
            middleware: ListCourseCoachingSessionPurchaseStatusResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCourseCoachingSessionPurchaseStatusUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCourseCoachingSessionPurchaseStatusViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCourseCoachingSessionPurchaseStatusUseCaseErrorResponse,
            TListCourseCoachingSessionPurchaseStatusResponseMiddleware
        >,
    ): viewModels.TListCourseCoachingSessionPurchaseStatusViewModel {
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

