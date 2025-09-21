import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const PassAssignmentRequestSchema = z.object({
  assignmentId: z.string(),
  studentId: z.number(),
});

export type TPassAssignmentRequest = z.infer<typeof PassAssignmentRequestSchema>;

export const PassAssignmentSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TPassAssignmentSuccessResponse = z.infer<typeof PassAssignmentSuccessResponseSchema>;

const PassAssignmentUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TPassAssignmentUseCaseErrorResponse = z.infer<typeof PassAssignmentUseCaseErrorResponseSchema>;

export const PassAssignmentUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  PassAssignmentSuccessResponseSchema,
  PassAssignmentUseCaseErrorResponseSchema,
]);

export type TPassAssignmentUseCaseResponse = z.infer<typeof PassAssignmentUseCaseResponseSchema>;
