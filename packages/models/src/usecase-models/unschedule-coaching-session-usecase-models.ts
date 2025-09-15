import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const UnscheduleCoachingSessionRequestSchema = z.object({
    coachingSessionId: z.number(),
});
export type TUnscheduleCoachingSessionRequest = z.infer<typeof UnscheduleCoachingSessionRequestSchema>;

export const UnscheduleCoachingSessionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));

export type TUnscheduleCoachingSessionSuccessResponse = z.infer<typeof UnscheduleCoachingSessionSuccessResponseSchema>;

const UnscheduleCoachingSessionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUnscheduleCoachingSessionUseCaseErrorResponse = z.infer<typeof UnscheduleCoachingSessionUseCaseErrorResponseSchema>;

export const UnscheduleCoachingSessionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    UnscheduleCoachingSessionSuccessResponseSchema,
    UnscheduleCoachingSessionUseCaseErrorResponseSchema,
]);

export type TUnscheduleCoachingSessionUseCaseResponse = z.infer<typeof UnscheduleCoachingSessionUseCaseResponseSchema>;