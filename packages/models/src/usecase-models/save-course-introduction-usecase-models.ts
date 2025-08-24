import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const SaveCourseIntroductionRequestSchema = z.object({
  courseSlug: z.string(),
  courseVersion: z.number(),
  text: z.string(),
  videoId: z.string().nullable(),
});

export type TSaveCourseIntroductionRequest = z.infer<typeof SaveCourseIntroductionRequestSchema>;

export const SaveCourseIntroductionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));

export type TSaveCourseIntroductionSuccessResponse = z.infer<typeof SaveCourseIntroductionSuccessResponseSchema>;

// TODO: add conflict handling
const SaveCourseIntroductionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSaveCourseIntroductionUseCaseErrorResponse = z.infer<typeof SaveCourseIntroductionUseCaseErrorResponseSchema>;

export const SaveCourseIntroductionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveCourseIntroductionSuccessResponseSchema,
  SaveCourseIntroductionUseCaseErrorResponseSchema,
]);

export type TSaveCourseIntroductionUseCaseResponse = z.infer<typeof SaveCourseIntroductionUseCaseResponseSchema>;