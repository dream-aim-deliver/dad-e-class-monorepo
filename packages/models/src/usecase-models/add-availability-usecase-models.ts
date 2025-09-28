import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const AddAvailabilityRequestSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export type TAddAvailabilityRequest = z.infer<typeof AddAvailabilityRequestSchema>;

export const AddAvailabilitySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TAddAvailabilitySuccessResponse = z.infer<typeof AddAvailabilitySuccessResponseSchema>;

const AddAvailabilityUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TAddAvailabilityUseCaseErrorResponse = z.infer<typeof AddAvailabilityUseCaseErrorResponseSchema>;

export const AddAvailabilityUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  AddAvailabilitySuccessResponseSchema,
  AddAvailabilityUseCaseErrorResponseSchema,
]);

export type TAddAvailabilityUseCaseResponse = z.infer<typeof AddAvailabilityUseCaseResponseSchema>;
