import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const RequestCoachingSessionRequestSchema = z.object({
  sessionId: z.number(),
  coachUsername: z.string(),
  startTime: z.string(),
  briefing: z.string(),
  lessonComponentId: z.string().optional(),
});

export type TRequestCoachingSessionRequest = z.infer<typeof RequestCoachingSessionRequestSchema>;

export const RequestCoachingSessionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TRequestCoachingSessionSuccessResponse = z.infer<typeof RequestCoachingSessionSuccessResponseSchema>;

const RequestCoachingSessionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TRequestCoachingSessionUseCaseErrorResponse = z.infer<typeof RequestCoachingSessionUseCaseErrorResponseSchema>;

export const RequestCoachingSessionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  RequestCoachingSessionSuccessResponseSchema,
  RequestCoachingSessionUseCaseErrorResponseSchema,
]);

export type TRequestCoachingSessionUseCaseResponse = z.infer<typeof RequestCoachingSessionUseCaseResponseSchema>;
