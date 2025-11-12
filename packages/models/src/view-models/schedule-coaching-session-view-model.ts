import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ScheduleCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ScheduleCoachingSessionSuccessSchema = ScheduleCoachingSessionSuccessResponseSchema.shape.data;
export type TScheduleCoachingSessionSuccess = z.infer<typeof ScheduleCoachingSessionSuccessSchema>;

// Define view mode schemas
const ScheduleCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ScheduleCoachingSessionSuccessSchema
);

const ScheduleCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ScheduleCoachingSessionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ScheduleCoachingSessionViewModelSchemaMap = {
    default: ScheduleCoachingSessionDefaultViewModelSchema,
    kaboom: ScheduleCoachingSessionKaboomViewModelSchema,
    notFound: ScheduleCoachingSessionNotFoundViewModelSchema,
};
export type TScheduleCoachingSessionViewModelSchemaMap = typeof ScheduleCoachingSessionViewModelSchemaMap;

// Create discriminated union of all view modes
export const ScheduleCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ScheduleCoachingSessionViewModelSchemaMap);
export type TScheduleCoachingSessionViewModel = z.infer<typeof ScheduleCoachingSessionViewModelSchema>;
