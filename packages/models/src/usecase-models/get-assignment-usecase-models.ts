import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { FileSchema, LinkItemSchema } from './common';

export const GetAssignmentRequestSchema = z.object({
  assignmentId: z.string(),
  studentId: z.number().optional(),
});

export type TGetAssignmentRequest = z.infer<typeof GetAssignmentRequestSchema>;

const AssignmentSender = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  role: z.string(),
});

const AssignmentPassedData = z.object({
  passedAt: z.number(), // timestamp
  sender: AssignmentSender,
});
export type TAssignmentPassedData = z.infer<typeof AssignmentPassedData>;

const AssignmentReply = z.object({
  sentAt: z.number(),
  comment: z.string(),
  files: z.array(FileSchema),
  links: z.array(LinkItemSchema),
  sender: AssignmentSender,
});
export type TAssignmentReply = z.infer<typeof AssignmentReply>;

const AssignmentProgressData = z.object({
  passedDetails: AssignmentPassedData.optional(),
  replies: z.array(AssignmentReply),
  student: AssignmentSender,
});

const AssignmentModuleData = z.object({
  id: z.number(),
  title: z.string(),
  position: z.number(),
});

const AssignmentLessonData = z.object({
  id: z.number(),
  title: z.string(),
  position: z.number(),
});

const AssignmentCourseData = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional(),
});

export const GetAssignmentSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  title: z.string(),
  description: z.string(),
  resources: z.array(FileSchema),
  links: z.array(LinkItemSchema),
  progress: AssignmentProgressData.optional(),
  module: AssignmentModuleData,
  lesson: AssignmentLessonData,
  course: AssignmentCourseData,
}));

export type TGetAssignmentSuccessResponse = z.infer<typeof GetAssignmentSuccessResponseSchema>;

const GetAssignmentUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetAssignmentUseCaseErrorResponse = z.infer<typeof GetAssignmentUseCaseErrorResponseSchema>;

export const GetAssignmentUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetAssignmentSuccessResponseSchema,
  GetAssignmentUseCaseErrorResponseSchema,
]);

export type TGetAssignmentUseCaseResponse = z.infer<typeof GetAssignmentUseCaseResponseSchema>;
