import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCoursesPresenterUtilities = {};

export const SearchCoursesResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        useCaseModels.TSearchCoursesUseCaseResponse,
        viewModels.TCourseSearchViewModel,
        TCoursesPresenterUtilities
    >;

type TSearchCoursesResponseMiddleware = typeof SearchCoursesResponseMiddleware;

export default class SearchCoursesPresenter extends BasePresenter<
    useCaseModels.TSearchCoursesUseCaseResponse,
    viewModels.TCourseSearchViewModel,
    TCoursesPresenterUtilities,
    TSearchCoursesResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TCourseSearchViewModel) => void,
        viewUtilities: TCoursesPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: useCaseModels.SearchCoursesUseCaseResponseSchema,
                viewModel: viewModels.CourseSearchViewModelSchema
            },
            middleware: SearchCoursesResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            useCaseModels.TSearchCoursesUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TCourseSearchViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            useCaseModels.TSearchCoursesUseCaseErrorResponse,
            TSearchCoursesResponseMiddleware
        >,
    ): viewModels.TCourseSearchViewModel {
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
