import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const SaveCourseDetailsRequestSchema = z.object({
  courseSlug: z.string(),
  courseVersion: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  selfStudyDuration: z.number().optional(),
  imageId: z.string().optional(),
  categoryId: z.number().optional(),
  topicIds: z.array(z.number()).optional(),
  requirementIds: z.array(z.number()).optional(),
});

export type TSaveCourseDetailsRequest = z.infer<typeof SaveCourseDetailsRequestSchema>;

export const SaveCourseDetailsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TSaveCourseDetailsSuccessResponse = z.infer<typeof SaveCourseDetailsSuccessResponseSchema>;

// TODO: add conflict handling
const SaveCourseDetailsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSaveCourseDetailsUseCaseErrorResponse = z.infer<typeof SaveCourseDetailsUseCaseErrorResponseSchema>;

export const SaveCourseDetailsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveCourseDetailsSuccessResponseSchema,
  SaveCourseDetailsUseCaseErrorResponseSchema,
]);

export type TSaveCourseDetailsUseCaseResponse = z.infer<typeof SaveCourseDetailsUseCaseResponseSchema>;