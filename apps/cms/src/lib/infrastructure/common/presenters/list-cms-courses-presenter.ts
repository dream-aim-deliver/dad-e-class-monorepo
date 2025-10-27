import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCmsCoursesUseCaseResponseSchema,
    TListCmsCoursesUseCaseResponse,
    TListCmsCoursesErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCmsCoursesPresenterUtilities = {};

export const ListCmsCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCmsCoursesUseCaseResponse,
        viewModels.TListCmsCoursesViewModel,
        TListCmsCoursesPresenterUtilities
    >;

type TListCmsCoursesResponseMiddleware = typeof ListCmsCoursesResponseMiddleware;

export default class ListCmsCoursesPresenter extends BasePresenter<
    TListCmsCoursesUseCaseResponse,
    viewModels.TListCmsCoursesViewModel,
    TListCmsCoursesPresenterUtilities,
    TListCmsCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCmsCoursesViewModel) => void,
        viewUtilities: TListCmsCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCmsCoursesUseCaseResponseSchema,
                viewModel: viewModels.ListCmsCoursesViewModelSchema
            },
            middleware: ListCmsCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCmsCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCmsCoursesViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCmsCoursesErrorResponse,
            TListCmsCoursesResponseMiddleware
        >,
    ): viewModels.TListCmsCoursesViewModel {
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
