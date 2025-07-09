import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCourseIntroductionRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetCourseIntroductionRequest = z.infer<typeof GetCourseIntroductionRequestSchema>;

export const GetCourseIntroductionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  text: z.string(),
  playbackId: z.string(),
  thumbnailUrl: z.string().nullable(),
}));

export type TGetCourseIntroductionSuccessResponse = z.infer<typeof GetCourseIntroductionSuccessResponseSchema>;

const GetCourseIntroductionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCourseIntroductionUseCaseErrorResponse = z.infer<typeof GetCourseIntroductionUseCaseErrorResponseSchema>;

export const GetCourseIntroductionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCourseIntroductionSuccessResponseSchema,
  GetCourseIntroductionUseCaseErrorResponseSchema,
]);

export type TGetCourseIntroductionUseCaseResponse = z.infer<typeof GetCourseIntroductionUseCaseResponseSchema>;
