import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseUpcomingCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetCourseUpcomingCoachingSessionSuccessSchema = GetCourseUpcomingCoachingSessionSuccessResponseSchema.shape.data;
export type TGetCourseUpcomingCoachingSessionSuccess = z.infer<typeof GetCourseUpcomingCoachingSessionSuccessSchema>;

// Define view mode schemas
const GetCourseUpcomingCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCourseUpcomingCoachingSessionSuccessSchema
);

const GetCourseUpcomingCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCourseUpcomingCoachingSessionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCourseUpcomingCoachingSessionViewModelSchemaMap = {
    default: GetCourseUpcomingCoachingSessionDefaultViewModelSchema,
    kaboom: GetCourseUpcomingCoachingSessionKaboomViewModelSchema,
    notFound: GetCourseUpcomingCoachingSessionNotFoundViewModelSchema,
};
export type TGetCourseUpcomingCoachingSessionViewModelSchemaMap = typeof GetCourseUpcomingCoachingSessionViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCourseUpcomingCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCourseUpcomingCoachingSessionViewModelSchemaMap);
export type TGetCourseUpcomingCoachingSessionViewModel = z.infer<typeof GetCourseUpcomingCoachingSessionViewModelSchema>;
