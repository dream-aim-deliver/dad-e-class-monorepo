import { viewModels } from '@maany_shr/e-class-models';
import {
    ListRequiredCoursesUseCaseResponseSchema,
    TListRequiredCoursesUseCaseResponse,
    TListRequiredCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListRequiredCoursesPresenterUtilities = {};

export const ListRequiredCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListRequiredCoursesUseCaseResponse,
        viewModels.TListRequiredCoursesViewModel,
        TListRequiredCoursesPresenterUtilities
    >;

type TListRequiredCoursesResponseMiddleware = typeof ListRequiredCoursesResponseMiddleware;

export default class ListRequiredCoursesPresenter extends BasePresenter<
    TListRequiredCoursesUseCaseResponse,
    viewModels.TListRequiredCoursesViewModel,
    TListRequiredCoursesPresenterUtilities,
    TListRequiredCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListRequiredCoursesViewModel) => void,
        viewUtilities: TListRequiredCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListRequiredCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListRequiredCoursesViewModelSchema
            },
            middleware: ListRequiredCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListRequiredCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListRequiredCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListRequiredCoursesErrorResponse,
            TListRequiredCoursesResponseMiddleware
        >,
    ): viewModels.TListRequiredCoursesViewModel {
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
