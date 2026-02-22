import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCoachAvailabilityRequestSchema = z.object({
  coachUsername: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type TGetCoachAvailabilityRequest = z.infer<typeof GetCoachAvailabilityRequestSchema>;

export const CoachingStatusSchema = z.enum(['unscheduled', 'requested', 'scheduled', 'canceled', 'completed']);
export type TCoachingStatus = z.infer<typeof CoachingStatusSchema>;

const AvailabilitySchema = z.object({
  id: z.number(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export type TAvailability = z.infer<typeof AvailabilitySchema>;

const CoachCoachingSessionSchema = z.object({
  id: z.number(),
  status: CoachingStatusSchema,
  sessionType: z.enum([
    'individual-unscheduled', 'individual-requested', 'individual-scheduled',
    'individual-canceled', 'individual-completed',
    'group-unscheduled', 'group-requested', 'group-scheduled',
    'group-canceled', 'group-completed',
  ]),
  coachingOfferingName: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export type TCoachCoachingSession = z.infer<typeof CoachCoachingSessionSchema>;

export const GetCoachAvailabilitySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  availability: z.array(AvailabilitySchema),
  mySessions: z.array(CoachCoachingSessionSchema),
}));

export type TGetCoachAvailabilitySuccessResponse = z.infer<typeof GetCoachAvailabilitySuccessResponseSchema>;

const GetCoachAvailabilityUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCoachAvailabilityUseCaseErrorResponse = z.infer<typeof GetCoachAvailabilityUseCaseErrorResponseSchema>;

export const GetCoachAvailabilityUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCoachAvailabilitySuccessResponseSchema,
  GetCoachAvailabilityUseCaseErrorResponseSchema,
]);

export type TGetCoachAvailabilityUseCaseResponse = z.infer<typeof GetCoachAvailabilityUseCaseResponseSchema>;
