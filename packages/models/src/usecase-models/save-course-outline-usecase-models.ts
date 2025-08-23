import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const SaveCourseOutlineRequestSchema = z.object({
  courseSlug: z.string(),
  courseVersion: z.number().min(1).optional(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    position: z.number(),
    iconId: z.string().nullable(),
  })),
});

export type TSaveCourseOutlineRequest = z.infer<typeof SaveCourseOutlineRequestSchema>;

export const SaveCourseOutlineSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TSaveCourseOutlineSuccessResponse = z.infer<typeof SaveCourseOutlineSuccessResponseSchema>;

const SaveCourseOutlineUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSaveCourseOutlineUseCaseErrorResponse = z.infer<typeof SaveCourseOutlineUseCaseErrorResponseSchema>;

export const SaveCourseOutlineUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveCourseOutlineSuccessResponseSchema,
  SaveCourseOutlineUseCaseErrorResponseSchema,
]);

export type TSaveCourseOutlineUseCaseResponse = z.infer<typeof SaveCourseOutlineUseCaseResponseSchema>;
