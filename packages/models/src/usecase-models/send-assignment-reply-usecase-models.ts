import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const SendAssignmentReplyRequestSchema = z.object({
  assignmentId: z.string(),
  studentId: z.number(),
  comment: z.string(),
  fileIds: z.array(z.number()),
  links: z.array(z.string()),
});

export type TSendAssignmentReplyRequest = z.infer<typeof SendAssignmentReplyRequestSchema>;

export const SendAssignmentReplySuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TSendAssignmentReplySuccessResponse = z.infer<typeof SendAssignmentReplySuccessResponseSchema>;

const SendAssignmentReplyUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSendAssignmentReplyUseCaseErrorResponse = z.infer<typeof SendAssignmentReplyUseCaseErrorResponseSchema>;

export const SendAssignmentReplyUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SendAssignmentReplySuccessResponseSchema,
  SendAssignmentReplyUseCaseErrorResponseSchema,
]);

export type TSendAssignmentReplyUseCaseResponse = z.infer<typeof SendAssignmentReplyUseCaseResponseSchema>;
