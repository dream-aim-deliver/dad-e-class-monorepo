import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { PreCourseAssessmentProgressSchema } from './common';

export const SubmitAssessmentProgressRequestSchema = z.object({
  progress: z.array(PreCourseAssessmentProgressSchema),
  courseSlug: z.string(),
  studentId: z.string().optional(),
});

export type TSubmitAssessmentProgressRequest = z.infer<typeof SubmitAssessmentProgressRequestSchema>;

export const SubmitAssessmentProgressSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));

export type TSubmitAssessmentProgressSuccessResponse = z.infer<typeof SubmitAssessmentProgressSuccessResponseSchema>;

const SubmitAssessmentProgressUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSubmitAssessmentProgressUseCaseErrorResponse = z.infer<typeof SubmitAssessmentProgressUseCaseErrorResponseSchema>;

export const SubmitAssessmentProgressUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SubmitAssessmentProgressSuccessResponseSchema,
  SubmitAssessmentProgressUseCaseErrorResponseSchema,
]);

export type TSubmitAssessmentProgressUseCaseResponse = z.infer<typeof SubmitAssessmentProgressUseCaseResponseSchema>;
