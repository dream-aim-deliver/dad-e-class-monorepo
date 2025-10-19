import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCouponsUseCaseResponseSchema,
    TListCouponsUseCaseResponse,
    TListCouponsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCouponsPresenterUtilities = {};

export const ListCouponsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCouponsUseCaseResponse,
        viewModels.TListCouponsViewModel,
        TListCouponsPresenterUtilities
    >;

type TListCouponsResponseMiddleware = typeof ListCouponsResponseMiddleware;

export default class ListCouponsPresenter extends BasePresenter<
    TListCouponsUseCaseResponse,
    viewModels.TListCouponsViewModel,
    TListCouponsPresenterUtilities,
    TListCouponsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCouponsViewModel) => void,
        viewUtilities: TListCouponsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCouponsUseCaseResponseSchema,
                viewModel: viewModels.ListCouponsViewModelSchema
            },
            middleware: ListCouponsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCouponsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCouponsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCouponsErrorResponse,
            TListCouponsResponseMiddleware
        >,
    ): viewModels.TListCouponsViewModel {
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
