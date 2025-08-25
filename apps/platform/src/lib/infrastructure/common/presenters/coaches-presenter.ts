import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachesPresenterUtilities = {};

export const ListCoachesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCoachesUseCaseResponse,
        viewModels.TCoachListViewModel,
        TCoachesPresenterUtilities
    >;

type TListCoachesResponseMiddleware = typeof ListCoachesResponseMiddleware;

export default class CoachesPresenter extends BasePresenter<
    useCaseModels.TListCoachesUseCaseResponse,
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
                responseModel: useCaseModels.GetHomePageUseCaseResponseSchema,
                viewModel: viewModels.HomePageViewModelSchema
            },
            middleware: ListCoachesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCoachesUseCaseResponse,
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
            useCaseModels.TListCoachesUseCaseErrorResponse,
            TListCoachesResponseMiddleware
        >,
    ): viewModels.TCoachListViewModel {
        if (response.data.errorType === 'NotFound') {
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
