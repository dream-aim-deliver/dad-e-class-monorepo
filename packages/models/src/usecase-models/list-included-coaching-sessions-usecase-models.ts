import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const ListIncludedCoachingSessionsRequestSchema = z.object({});

export type TListIncludedCoachingSessionsRequest = z.infer<typeof ListIncludedCoachingSessionsRequestSchema>;

export const ListIncludedCoachingSessionsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  offers: z.array(
    z.object({
      name: z.string(),
      duration: z.number().int().positive(), // minutes
      availableIds: z.array(z.string().or(z.number())),
      usedCount: z.number().int().min(0)
    })
  )
}));

export type TListIncludedCoachingSessionsSuccessResponse = z.infer<typeof ListIncludedCoachingSessionsSuccessResponseSchema>;

const ListIncludedCoachingSessionsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListIncludedCoachingSessionsUseCaseErrorResponse = z.infer<typeof ListIncludedCoachingSessionsUseCaseErrorResponseSchema>;

export const ListIncludedCoachingSessionsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListIncludedCoachingSessionsSuccessResponseSchema,
  ListIncludedCoachingSessionsUseCaseErrorResponseSchema,
]);

export type TListIncludedCoachingSessionsUseCaseResponse = z.infer<typeof ListIncludedCoachingSessionsUseCaseResponseSchema>;
