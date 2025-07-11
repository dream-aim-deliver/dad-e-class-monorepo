import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCourseOutlineRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetCourseOutlineRequest = z.infer<typeof GetCourseOutlineRequestSchema>;

export const GetCourseOutlineSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    position: z.number().int().min(0),
  }))
}));

export type TGetCourseOutlineSuccessResponse = z.infer<typeof GetCourseOutlineSuccessResponseSchema>;

const GetCourseOutlineUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCourseOutlineUseCaseErrorResponse = z.infer<typeof GetCourseOutlineUseCaseErrorResponseSchema>;

export const GetCourseOutlineUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCourseOutlineSuccessResponseSchema,
  GetCourseOutlineUseCaseErrorResponseSchema,
]);

export type TGetCourseOutlineUseCaseResponse = z.infer<typeof GetCourseOutlineUseCaseResponseSchema>;
