import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { AnswerSchema } from './common';

export const ListAssessmentProgressesRequestSchema = z.object({
  courseSlug: z.string(),
  studentId: z.string().optional(),
});

export type TListAssessmentProgressesRequest = z.infer<typeof ListAssessmentProgressesRequestSchema>;

export const ListAssessmentProgressesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  progress: z.array(AnswerSchema)
}));

export type TListAssessmentProgressesSuccessResponse = z.infer<typeof ListAssessmentProgressesSuccessResponseSchema>;

const ListAssessmentProgressesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  
});
export type TListAssessmentProgressesUseCaseErrorResponse = z.infer<typeof ListAssessmentProgressesUseCaseErrorResponseSchema>;

export const ListAssessmentProgressesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListAssessmentProgressesSuccessResponseSchema,
  ListAssessmentProgressesUseCaseErrorResponseSchema,
]);

export type TListAssessmentProgressesUseCaseResponse = z.infer<typeof ListAssessmentProgressesUseCaseResponseSchema>;
