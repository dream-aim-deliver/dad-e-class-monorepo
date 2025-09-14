import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListStudentNotesSuccessResponseSchema } from '../usecase-models/list-student-notes-usecase-models';

export const StudentNotesSuccessSchema = ListStudentNotesSuccessResponseSchema.shape.data;

export type TStudentNotesSuccess = z.infer<typeof StudentNotesSuccessSchema>;

const StudentNotesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", StudentNotesSuccessSchema);
const StudentNotesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const StudentNotesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const StudentNotesViewModelSchemaMap = {
    default: StudentNotesDefaultViewModelSchema,
    kaboom: StudentNotesKaboomViewModelSchema,
    notFound: StudentNotesNotFoundViewModelSchema,
};
export type TStudentNotesViewModelSchemaMap = typeof StudentNotesViewModelSchemaMap;
export const StudentNotesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(StudentNotesViewModelSchemaMap);
export type TStudentNotesViewModel = z.infer<typeof StudentNotesViewModelSchema>;
