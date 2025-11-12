import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUpcomingStudentCoachingSessionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUpcomingStudentCoachingSessionsSuccessSchema = ListUpcomingStudentCoachingSessionsSuccessResponseSchema.shape.data;
export type TListUpcomingStudentCoachingSessionsSuccess = z.infer<typeof ListUpcomingStudentCoachingSessionsSuccessSchema>;

// Define view mode schemas
const ListUpcomingStudentCoachingSessionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUpcomingStudentCoachingSessionsSuccessSchema
);

const ListUpcomingStudentCoachingSessionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUpcomingStudentCoachingSessionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUpcomingStudentCoachingSessionsViewModelSchemaMap = {
    default: ListUpcomingStudentCoachingSessionsDefaultViewModelSchema,
    kaboom: ListUpcomingStudentCoachingSessionsKaboomViewModelSchema,
    notFound: ListUpcomingStudentCoachingSessionsNotFoundViewModelSchema,
};
export type TListUpcomingStudentCoachingSessionsViewModelSchemaMap = typeof ListUpcomingStudentCoachingSessionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUpcomingStudentCoachingSessionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUpcomingStudentCoachingSessionsViewModelSchemaMap);
export type TListUpcomingStudentCoachingSessionsViewModel = z.infer<typeof ListUpcomingStudentCoachingSessionsViewModelSchema>;
