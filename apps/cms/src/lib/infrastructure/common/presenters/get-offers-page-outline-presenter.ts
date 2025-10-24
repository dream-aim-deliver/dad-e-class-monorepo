import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    GetOffersPageOutlineUseCaseResponseSchema,
    TGetOffersPageOutlineUseCaseResponse,
    TGetOffersPageOutlineUseCaseErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetOffersPageOutlinePresenterUtilities = {};

export const GetOffersPageOutlineResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetOffersPageOutlineUseCaseResponse,
        viewModels.TGetOffersPageOutlineViewModel,
        TGetOffersPageOutlinePresenterUtilities
    >;

type TGetOffersPageOutlineResponseMiddleware =
    typeof GetOffersPageOutlineResponseMiddleware;

export default class OffersPageOutlinePresenter extends BasePresenter<
    TGetOffersPageOutlineUseCaseResponse,
    viewModels.TGetOffersPageOutlineViewModel,
    TGetOffersPageOutlinePresenterUtilities,
    TGetOffersPageOutlineResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TGetOffersPageOutlineViewModel,
        ) => void,
        viewUtilities: TGetOffersPageOutlinePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetOffersPageOutlineUseCaseResponseSchema,
                viewModel: viewModels.GetOffersPageOutlineViewModelSchema
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
    ): viewModels.TGetOffersPageOutlineViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TGetOffersPageOutlineUseCaseErrorResponse,
            TGetOffersPageOutlineResponseMiddleware
        >,
    ): viewModels.TGetOffersPageOutlineViewModel {
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
