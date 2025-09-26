import { viewModels } from '@maany_shr/e-class-models';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';
import {
    TGetLessonNoteUseCaseResponse as TSaveLessonNoteUseCaseResponse,
    GetLessonNoteUseCaseResponseSchema as SaveLessonNoteUseCaseResponseSchema
} from '@dream-aim-deliver/e-class-cms-rest';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TSaveLessonNotePresenterUtilities = {};

export const SaveLessonNoteResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TSaveLessonNoteUseCaseResponse,
        viewModels.TLessonNoteViewModel,
        TSaveLessonNotePresenterUtilities
    >;

type TSaveLessonNoteResponseMiddleware = typeof SaveLessonNoteResponseMiddleware;

export default class SaveLessonNotePresenter extends BasePresenter<
    TSaveLessonNoteUseCaseResponse,
    viewModels.TLessonNoteViewModel,
    TSaveLessonNotePresenterUtilities,
    TSaveLessonNoteResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TLessonNoteViewModel) => void,
        viewUtilities: TSaveLessonNotePresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: SaveLessonNoteUseCaseResponseSchema,
                viewModel: viewModels.LessonNoteViewModelSchema
            },
            middleware: SaveLessonNoteResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TSaveLessonNoteUseCaseResponse,
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
            TSaveLessonNoteResponseMiddleware
        >,
    ): viewModels.TLessonNoteViewModel {
        return {
            mode: 'kaboom',
            data: {
                message: response.data?.message || 'Failed to save lesson note',
                operation: response.data?.operation || 'save-lesson-note',
                context: response.data?.context || {}
            }
        };
    }
}