import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const LessonNoteSuccessSchema = z.object({
    lessonId: z.number(),
    content: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type TLessonNoteSuccess = z.infer<typeof LessonNoteSuccessSchema>;

const LessonNoteDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", LessonNoteSuccessSchema);
const LessonNoteLoadingViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("loading", z.object({}));
const LessonNoteKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const LessonNoteViewModelSchemaMap = {
    default: LessonNoteDefaultViewModelSchema,
    loading: LessonNoteLoadingViewModelSchema,
    kaboom: LessonNoteKaboomViewModelSchema,
};
export type TLessonNoteViewModelSchemaMap = typeof LessonNoteViewModelSchemaMap;
export const LessonNoteViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(LessonNoteViewModelSchemaMap);
export type TLessonNoteViewModel = z.infer<typeof LessonNoteViewModelSchema>;