import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetStudentProgressSuccessResponseSchema } from '../usecase-models/get-student-progress-usecase-models';

export const StudentProgressSuccessSchema = GetStudentProgressSuccessResponseSchema.shape.data;

export type TStudentProgressSuccess = z.infer<typeof StudentProgressSuccessSchema>;

const StudentProgressDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", StudentProgressSuccessSchema);
const StudentProgressKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const StudentProgressViewModelSchemaMap = {
    default: StudentProgressDefaultViewModelSchema,
    kaboom: StudentProgressKaboomViewModelSchema,
};
export type TStudentProgressViewModelSchemaMap = typeof StudentProgressViewModelSchemaMap;
export const StudentProgressViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(StudentProgressViewModelSchemaMap);
export type TStudentProgressViewModel = z.infer<typeof StudentProgressViewModelSchema>;
