import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoachCoursesUseCaseResponseSchema,
    TListCoachCoursesUseCaseResponse,
    TListCoachCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoachCoursesPresenterUtilities = {};

export const ListCoachCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoachCoursesUseCaseResponse,
        viewModels.TListCoachCoursesViewModel,
        TListCoachCoursesPresenterUtilities
    >;

type TListCoachCoursesResponseMiddleware = typeof ListCoachCoursesResponseMiddleware;

export default class ListCoachCoursesPresenter extends BasePresenter<
    TListCoachCoursesUseCaseResponse,
    viewModels.TListCoachCoursesViewModel,
    TListCoachCoursesPresenterUtilities,
    TListCoachCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoachCoursesViewModel) => void,
        viewUtilities: TListCoachCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoachCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListCoachCoursesViewModelSchema
            },
            middleware: ListCoachCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoachCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCoachCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoachCoursesErrorResponse,
            TListCoachCoursesResponseMiddleware
        >,
    ): viewModels.TListCoachCoursesViewModel {
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
