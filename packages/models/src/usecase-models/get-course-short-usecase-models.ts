import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCourseShortRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetCourseShortRequest = z.infer<typeof GetCourseShortRequestSchema>;

export const GetCourseShortSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  title: z.string(),
  imageUrl: z.string().nullable(),
}));

export type TGetCourseShortSuccessResponse = z.infer<typeof GetCourseShortSuccessResponseSchema>;

const GetCourseShortUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCourseShortUseCaseErrorResponse = z.infer<typeof GetCourseShortUseCaseErrorResponseSchema>;

export const GetCourseShortUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCourseShortSuccessResponseSchema,
  GetCourseShortUseCaseErrorResponseSchema,
]);

export type TGetCourseShortUseCaseResponse = z.infer<typeof GetCourseShortUseCaseResponseSchema>;
