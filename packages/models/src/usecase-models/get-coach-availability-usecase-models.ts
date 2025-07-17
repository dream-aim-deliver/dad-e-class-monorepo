import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCoachAvailabilityRequestSchema = z.object({
  coachUsername: z.string(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type TGetCoachAvailabilityRequest = z.infer<typeof GetCoachAvailabilityRequestSchema>;

export const CoachingStatusSchema = z.enum(['unscheduled', 'requested', 'accepted', 'completed']);
export type TCoachingStatus = z.infer<typeof CoachingStatusSchema>;

export const GetCoachAvailabilitySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  availability: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('single'),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
    }),
    z.object({
      type: z.literal('recurring'),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      monday: z.boolean(),
      tuesday: z.boolean(), 
      wednesday: z.boolean(),
      thursday: z.boolean(),
      friday: z.boolean(),
      saturday: z.boolean(),
      sunday: z.boolean(),
      createdAt: z.string().datetime(),
      expirationDate: z.string().datetime(),
    })
  ]).array(),
  mySessions: z.array(z.object({
    id: z.number(),
    status: CoachingStatusSchema,
    coachingOfferingName: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  })),
  anonymousSessions: z.array(z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  })),
}));

export type TGetCoachAvailabilitySuccessResponse = z.infer<typeof GetCoachAvailabilitySuccessResponseSchema>;

const GetCoachAvailabilityUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCoachAvailabilityUseCaseErrorResponse = z.infer<typeof GetCoachAvailabilityUseCaseErrorResponseSchema>;

export const GetCoachAvailabilityUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCoachAvailabilitySuccessResponseSchema,
  GetCoachAvailabilityUseCaseErrorResponseSchema,
]);

export type TGetCoachAvailabilityUseCaseResponse = z.infer<typeof GetCoachAvailabilityUseCaseResponseSchema>;
