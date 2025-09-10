import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoachStudentsPresenterUtilities = {};

export const ListCoachStudentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TListCoachStudentsUseCaseResponse,
        viewModels.TCoachStudentsViewModel,
        TCoachStudentsPresenterUtilities
    >;

type TListCoachStudentsResponseMiddleware =
    typeof ListCoachStudentsResponseMiddleware;

export default class ListCoachStudentsPresenter extends BasePresenter<
    useCaseModels.TListCoachStudentsUseCaseResponse,
    viewModels.TCoachStudentsViewModel,
    TCoachStudentsPresenterUtilities,
    TListCoachStudentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCoachStudentsViewModel) => void,
        viewUtilities: TCoachStudentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    useCaseModels.ListCoachStudentsUseCaseResponseSchema,
                viewModel: viewModels.CoachStudentsViewModelSchema
            },
            middleware: ListCoachStudentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TListCoachStudentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCoachStudentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TListCoachStudentsUseCaseErrorResponse,
            TListCoachStudentsResponseMiddleware
        >,
    ): viewModels.TCoachStudentsViewModel {
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
