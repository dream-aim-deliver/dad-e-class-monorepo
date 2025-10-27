import { viewModels } from '@maany_shr/e-class-models';
import {
    ListPlatformCoachesUseCaseResponseSchema,
    TListPlatformCoachesUseCaseResponse,
    TListPlatformCoachesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListPlatformCoachesPresenterUtilities = {};

export const ListPlatformCoachesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListPlatformCoachesUseCaseResponse,
        viewModels.TListPlatformCoachesViewModel,
        TListPlatformCoachesPresenterUtilities
    >;

type TListPlatformCoachesResponseMiddleware = typeof ListPlatformCoachesResponseMiddleware;

export default class ListPlatformCoachesPresenter extends BasePresenter<
    TListPlatformCoachesUseCaseResponse,
    viewModels.TListPlatformCoachesViewModel,
    TListPlatformCoachesPresenterUtilities,
    TListPlatformCoachesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListPlatformCoachesViewModel) => void,
        viewUtilities: TListPlatformCoachesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListPlatformCoachesUseCaseResponseSchema,
                viewModel: viewModels.ListPlatformCoachesViewModelSchema
            },
            middleware: ListPlatformCoachesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListPlatformCoachesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListPlatformCoachesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListPlatformCoachesErrorResponse,
            TListPlatformCoachesResponseMiddleware
        >,
    ): viewModels.TListPlatformCoachesViewModel {
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
