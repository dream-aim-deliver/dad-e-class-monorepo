import { viewModels } from '@maany_shr/e-class-models';
import { TListLessonComponentsUseCaseResponse, ListLessonComponentsUseCaseResponseSchema, TListLessonComponentsUseCaseErrorResponse } from "@dream-aim-deliver/e-class-cms-rest"
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TLessonComponentsPresenterUtilities = {};

export const ListLessonComponentsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListLessonComponentsUseCaseResponse,
        viewModels.TLessonComponentListViewModel,
        TLessonComponentsPresenterUtilities
    >;

type TListLessonComponentsResponseMiddleware =
    typeof ListLessonComponentsResponseMiddleware;

export default class LessonComponentsPresenter extends BasePresenter<
    TListLessonComponentsUseCaseResponse,
    viewModels.TLessonComponentListViewModel,
    TLessonComponentsPresenterUtilities,
    TListLessonComponentsResponseMiddleware
> {
    constructor(
        setViewModel: (
            viewModel: viewModels.TLessonComponentListViewModel,
        ) => void,
        viewUtilities: TLessonComponentsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel:
                    ListLessonComponentsUseCaseResponseSchema,
                viewModel: viewModels.LessonComponentListViewModelSchema
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
    ): viewModels.TLessonComponentListViewModel {
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
    ): viewModels.TLessonComponentListViewModel {
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
