import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetStudentCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const StudentCoachingSessionSuccessSchema = GetStudentCoachingSessionSuccessResponseSchema.shape.data;

export type TStudentCoachingSessionSuccess = z.infer<typeof StudentCoachingSessionSuccessSchema>;

const StudentCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", StudentCoachingSessionSuccessSchema);
const StudentCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const StudentCoachingSessionViewModelSchemaMap = {
    default: StudentCoachingSessionDefaultViewModelSchema,
    kaboom: StudentCoachingSessionKaboomViewModelSchema,
};
export type TStudentCoachingSessionViewModelSchemaMap = typeof StudentCoachingSessionViewModelSchemaMap;
export const StudentCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(StudentCoachingSessionViewModelSchemaMap);
export type TStudentCoachingSessionViewModel = z.infer<typeof StudentCoachingSessionViewModelSchema>;
