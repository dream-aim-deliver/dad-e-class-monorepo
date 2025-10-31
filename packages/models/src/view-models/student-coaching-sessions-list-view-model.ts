import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListStudentCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const StudentCoachingSessionsListSuccessSchema = ListStudentCoachingSessionsSuccessResponseSchema.shape.data;

export type TStudentCoachingSessionsListSuccess = z.infer<typeof StudentCoachingSessionsListSuccessSchema>;

const StudentCoachingSessionsListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", StudentCoachingSessionsListSuccessSchema);
const StudentCoachingSessionsListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const StudentCoachingSessionsListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const StudentCoachingSessionsListViewModelSchemaMap = {
    default: StudentCoachingSessionsListDefaultViewModelSchema,
    kaboom: StudentCoachingSessionsListKaboomViewModelSchema,
    notFound: StudentCoachingSessionsListNotFoundViewModelSchema,
};
export type TStudentCoachingSessionsListViewModelSchemaMap = typeof StudentCoachingSessionsListViewModelSchemaMap;
export const StudentCoachingSessionsListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(StudentCoachingSessionsListViewModelSchemaMap);
export type TStudentCoachingSessionsListViewModel = z.infer<typeof StudentCoachingSessionsListViewModelSchema>;