import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ScheduleCoachingSessionSuccessResponseSchema } from '../usecase-models/schedule-coaching-session-usecase-models';

export const ScheduleCoachingSessionSuccessSchema = ScheduleCoachingSessionSuccessResponseSchema.shape.data;

export type TScheduleCoachingSessionSuccess = z.infer<typeof ScheduleCoachingSessionSuccessSchema>;

const ScheduleCoachingSessionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", ScheduleCoachingSessionSuccessSchema);
const ScheduleCoachingSessionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const ScheduleCoachingSessionViewModelSchemaMap = {
    default: ScheduleCoachingSessionDefaultViewModelSchema,
    kaboom: ScheduleCoachingSessionKaboomViewModelSchema,
};
export type TScheduleCoachingSessionViewModelSchemaMap = typeof ScheduleCoachingSessionViewModelSchemaMap;
export const ScheduleCoachingSessionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ScheduleCoachingSessionViewModelSchemaMap);
export type TScheduleCoachingSessionViewModel = z.infer<typeof ScheduleCoachingSessionViewModelSchema>;