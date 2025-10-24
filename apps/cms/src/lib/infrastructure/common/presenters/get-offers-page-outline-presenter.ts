import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    GetOffersPageOutlineUseCaseResponseSchema,
    TGetOffersPageOutlineUseCaseResponse,
    TGetOffersPageOutlineErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TOffersPageOutlinePresenterUtilities = {};

export const GetOffersPageOutlineResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetOffersPageOutlineUseCaseResponse,
        viewModels.TOffersPageOutlineViewModel,
        TOffersPageOutlinePresenterUtilities
    >;

type TGetOffersPageOutlineResponseMiddleware =
    typeof GetOffersPageOutlineResponseMiddleware;

export default class OffersPageOutlinePresenter extends BasePresenter<
    TGetOffersPageOutlineUseCaseResponse,
    viewModels.TOffersPageOutlineViewModel,
    TOffersPageOutlinePresenterUtilities,
    TGetOffersPageOutlineResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TOffersPageOutlineViewModel,
        ) => void,
        viewUtilities: TOffersPageOutlinePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetOffersPageOutlineUseCaseResponseSchema,
                viewModel: viewModels.OffersPageOutlineViewModelSchema
            },
            middleware: GetOffersPageOutlineResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetOffersPageOutlineUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TOffersPageOutlineViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TGetOffersPageOutlineErrorResponse,
            TGetOffersPageOutlineResponseMiddleware
        >,
    ): viewModels.TOffersPageOutlineViewModel {
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
