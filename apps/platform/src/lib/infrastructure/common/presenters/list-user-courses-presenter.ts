import { viewModels } from '@maany_shr/e-class-models';
import {
    ListUserCoursesUseCaseResponseSchema,
    TListUserCoursesUseCaseResponse,
    TListUserCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListUserCoursesPresenterUtilities = {};

export const ListUserCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListUserCoursesUseCaseResponse,
        viewModels.TListUserCoursesViewModel,
        TListUserCoursesPresenterUtilities
    >;

type TListUserCoursesResponseMiddleware = typeof ListUserCoursesResponseMiddleware;

export default class ListUserCoursesPresenter extends BasePresenter<
    TListUserCoursesUseCaseResponse,
    viewModels.TListUserCoursesViewModel,
    TListUserCoursesPresenterUtilities,
    TListUserCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListUserCoursesViewModel) => void,
        viewUtilities: TListUserCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListUserCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListUserCoursesViewModelSchema
            },
            middleware: ListUserCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListUserCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListUserCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListUserCoursesErrorResponse,
            TListUserCoursesResponseMiddleware
        >,
    ): viewModels.TListUserCoursesViewModel {
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
