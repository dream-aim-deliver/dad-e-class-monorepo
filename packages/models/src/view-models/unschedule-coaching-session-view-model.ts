import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UnscheduleCoachingSessionSuccessResponseSchema } from '../usecase-models/unschedule-coaching-session-usecase-models';

export const UnscheduleCoachingSessionSuccessSchema = UnscheduleCoachingSessionSuccessResponseSchema.shape.data;

export type TUnscheduleCoachingSessionSuccess = z.infer<typeof UnscheduleCoachingSessionSuccessSchema>;

const UnscheduleCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", UnscheduleCoachingSessionSuccessSchema);
const UnscheduleCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const UnscheduleCoachingSessionViewModelSchemaMap = {
    default: UnscheduleCoachingSessionDefaultViewModelSchema,
    kaboom: UnscheduleCoachingSessionKaboomViewModelSchema,
};
export type TUnscheduleCoachingSessionViewModelSchemaMap = typeof UnscheduleCoachingSessionViewModelSchemaMap;
export const UnscheduleCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UnscheduleCoachingSessionViewModelSchemaMap);
export type TUnscheduleCoachingSessionViewModel = z.infer<typeof UnscheduleCoachingSessionViewModelSchema>;