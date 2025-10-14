import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachStudentsUseCaseResponseSchema,
    TListCoachStudentsUseCaseResponse,
    TListCoachStudentsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachStudentsPresenterUtilities = {};

export const ListCoachStudentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachStudentsUseCaseResponse,
        viewModels.TListCoachStudentsViewModel,
        TListCoachStudentsPresenterUtilities
    >;

type TListCoachStudentsResponseMiddleware = typeof ListCoachStudentsResponseMiddleware;

export default class ListCoachStudentsPresenter extends BasePresenter<
    TListCoachStudentsUseCaseResponse,
    viewModels.TListCoachStudentsViewModel,
    TListCoachStudentsPresenterUtilities,
    TListCoachStudentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachStudentsViewModel) => void,
        viewUtilities: TListCoachStudentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachStudentsUseCaseResponseSchema,
                viewModel: viewModels.ListCoachStudentsViewModelSchema
            },
            middleware: ListCoachStudentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachStudentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCoachStudentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachStudentsErrorResponse,
            TListCoachStudentsResponseMiddleware
        >,
    ): viewModels.TListCoachStudentsViewModel {
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
