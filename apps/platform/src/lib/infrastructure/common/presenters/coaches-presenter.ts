import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachesUseCaseResponseSchema,
    TListCoachesUseCaseResponse,
    TListCoachesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachesPresenterUtilities = {};

export const ListCoachesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachesUseCaseResponse,
        viewModels.TCoachListViewModel,
        TCoachesPresenterUtilities
    >;

type TListCoachesResponseMiddleware = typeof ListCoachesResponseMiddleware;

export default class CoachesPresenter extends BasePresenter<
    TListCoachesUseCaseResponse,
    viewModels.TCoachListViewModel,
    TCoachesPresenterUtilities,
    TListCoachesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCoachListViewModel) => void,
        viewUtilities: TCoachesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachesUseCaseResponseSchema,
                viewModel: viewModels.CoachListViewModelSchema
            },
            middleware: ListCoachesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachListViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }
    presentError(
        response: UnhandledErrorResponse<
            TListCoachesErrorResponse,
            TListCoachesResponseMiddleware
        >,
    ): viewModels.TCoachListViewModel {
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
