import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCoursesUseCaseResponseSchema,
    TListCoursesUseCaseResponse,
    TListCoursesUseCaseErrorResponse
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCoursesPresenterUtilities = {};

export const ListCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCoursesUseCaseResponse,
        viewModels.TListCoursesViewModel,
        TListCoursesPresenterUtilities
    >;

type TListCoursesResponseMiddleware = typeof ListCoursesResponseMiddleware;

export default class ListCoursesPresenter extends BasePresenter<
    TListCoursesUseCaseResponse,
    viewModels.TListCoursesViewModel,
    TListCoursesPresenterUtilities,
    TListCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCoursesViewModel) => void,
        viewUtilities: TListCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListCoursesViewModelSchema
            },
            middleware: ListCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCoursesUseCaseErrorResponse,
            TListCoursesResponseMiddleware
        >,
    ): viewModels.TListCoursesViewModel {
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
