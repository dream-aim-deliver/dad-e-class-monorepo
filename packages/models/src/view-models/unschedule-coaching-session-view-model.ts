import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UnscheduleCoachingSessionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const UnscheduleCoachingSessionSuccessSchema = UnscheduleCoachingSessionSuccessResponseSchema.shape.data;
export type TUnscheduleCoachingSessionSuccess = z.infer<typeof UnscheduleCoachingSessionSuccessSchema>;

// Define view mode schemas
const UnscheduleCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    UnscheduleCoachingSessionSuccessSchema
);

const UnscheduleCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const UnscheduleCoachingSessionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const UnscheduleCoachingSessionViewModelSchemaMap = {
    default: UnscheduleCoachingSessionDefaultViewModelSchema,
    kaboom: UnscheduleCoachingSessionKaboomViewModelSchema,
    notFound: UnscheduleCoachingSessionNotFoundViewModelSchema,
};
export type TUnscheduleCoachingSessionViewModelSchemaMap = typeof UnscheduleCoachingSessionViewModelSchemaMap;

// Create discriminated union of all view modes
export const UnscheduleCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UnscheduleCoachingSessionViewModelSchemaMap);
export type TUnscheduleCoachingSessionViewModel = z.infer<typeof UnscheduleCoachingSessionViewModelSchema>;
