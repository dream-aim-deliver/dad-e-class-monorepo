import { viewModels } from '@maany_shr/e-class-models';
import {
    ListLessonComponentsUseCaseResponseSchema,
    TListLessonComponentsUseCaseResponse,
    TListLessonComponentsUseCaseErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListLessonComponentsPresenterUtilities = {};

export const ListLessonComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListLessonComponentsUseCaseResponse,
        viewModels.TListLessonComponentsViewModel,
        TListLessonComponentsPresenterUtilities
    >;

type TListLessonComponentsResponseMiddleware = typeof ListLessonComponentsResponseMiddleware;

export default class ListLessonComponentsPresenter extends BasePresenter<
    TListLessonComponentsUseCaseResponse,
    viewModels.TListLessonComponentsViewModel,
    TListLessonComponentsPresenterUtilities,
    TListLessonComponentsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListLessonComponentsViewModel) => void,
        viewUtilities: TListLessonComponentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListLessonComponentsUseCaseResponseSchema,
                viewModel: viewModels.ListLessonComponentsViewModelSchema
            },
            middleware: ListLessonComponentsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListLessonComponentsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListLessonComponentsViewModel {
        return {
            mode: 'default',
            data: {
                ...response.data
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListLessonComponentsUseCaseErrorResponse,
            TListLessonComponentsResponseMiddleware
        >,
    ): viewModels.TListLessonComponentsViewModel {
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
