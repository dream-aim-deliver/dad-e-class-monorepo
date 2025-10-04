import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const ScheduleCoachingSessionRequestSchema = z.object({
  coachingSessionId: z.number(),
});

export type TScheduleCoachingSessionRequest = z.infer<typeof ScheduleCoachingSessionRequestSchema>;

export const ScheduleCoachingSessionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TScheduleCoachingSessionSuccessResponse = z.infer<typeof ScheduleCoachingSessionSuccessResponseSchema>;

const ScheduleCoachingSessionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TScheduleCoachingSessionUseCaseErrorResponse = z.infer<typeof ScheduleCoachingSessionUseCaseErrorResponseSchema>;

export const ScheduleCoachingSessionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ScheduleCoachingSessionSuccessResponseSchema,
  ScheduleCoachingSessionUseCaseErrorResponseSchema,
]);

export type TScheduleCoachingSessionUseCaseResponse = z.infer<typeof ScheduleCoachingSessionUseCaseResponseSchema>;
