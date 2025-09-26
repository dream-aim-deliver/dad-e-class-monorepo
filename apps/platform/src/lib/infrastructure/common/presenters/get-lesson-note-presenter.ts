import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetLessonNoteUseCaseResponse,
    GetLessonNoteUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGetLessonNotePresenterUtilities = {};

export const GetLessonNoteResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TGetLessonNoteUseCaseResponse,
        viewModels.TLessonNoteViewModel,
        TGetLessonNotePresenterUtilities
    >;

type TGetLessonNoteResponseMiddleware = typeof GetLessonNoteResponseMiddleware;

export default class GetLessonNotePresenter extends BasePresenter<
    TGetLessonNoteUseCaseResponse,
    viewModels.TLessonNoteViewModel,
    TGetLessonNotePresenterUtilities,
    TGetLessonNoteResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TLessonNoteViewModel) => void,
        viewUtilities: TGetLessonNotePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: GetLessonNoteUseCaseResponseSchema,
                viewModel: viewModels.LessonNoteViewModelSchema
            },
            middleware: GetLessonNoteResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TGetLessonNoteUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TLessonNoteViewModel {
        return {
            mode: 'default',
            data: {
                lessonId: response.data.lessonId,
                content: response.data.content,
                updatedAt: response.data.updatedAt
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any,
            TGetLessonNoteResponseMiddleware
        >,
    ): viewModels.TLessonNoteViewModel {
        return {
            mode: 'kaboom',
            data: {
                message: response.data?.message || 'Failed to load lesson note',
                operation: response.data?.operation || 'get-lesson-note',
                context: response.data?.context || {}
            }
        };
    }
}