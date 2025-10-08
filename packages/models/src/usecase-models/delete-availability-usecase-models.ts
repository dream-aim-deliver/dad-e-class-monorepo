import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const DeleteAvailabilityRequestSchema = z.object({
  availabilityId: z.number(),
});

export type TDeleteAvailabilityRequest = z.infer<typeof DeleteAvailabilityRequestSchema>;

export const DeleteAvailabilitySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TDeleteAvailabilitySuccessResponse = z.infer<typeof DeleteAvailabilitySuccessResponseSchema>;

const DeleteAvailabilityUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TDeleteAvailabilityUseCaseErrorResponse = z.infer<typeof DeleteAvailabilityUseCaseErrorResponseSchema>;

export const DeleteAvailabilityUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  DeleteAvailabilitySuccessResponseSchema,
  DeleteAvailabilityUseCaseErrorResponseSchema,
]);

export type TDeleteAvailabilityUseCaseResponse = z.infer<typeof DeleteAvailabilityUseCaseResponseSchema>;
