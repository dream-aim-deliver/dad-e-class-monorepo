import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const TogglePreCourseAssessmentRequestSchema = z.object({
  enablePreCourseAssessment: z.boolean(),
});

export type TTogglePreCourseAssessmentRequest = z.infer<typeof TogglePreCourseAssessmentRequestSchema>;

export const TogglePreCourseAssessmentSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TTogglePreCourseAssessmentSuccessResponse = z.infer<typeof TogglePreCourseAssessmentSuccessResponseSchema>;

const TogglePreCourseAssessmentUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TTogglePreCourseAssessmentUseCaseErrorResponse = z.infer<typeof TogglePreCourseAssessmentUseCaseErrorResponseSchema>;

export const TogglePreCourseAssessmentUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  TogglePreCourseAssessmentSuccessResponseSchema,
  TogglePreCourseAssessmentUseCaseErrorResponseSchema,
]);

export type TTogglePreCourseAssessmentUseCaseResponse = z.infer<typeof TogglePreCourseAssessmentUseCaseResponseSchema>;
