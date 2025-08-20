import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { GetCourseStructureSuccessResponseSchema } from './get-course-structure-usecase-models';

export const SaveCourseStructureRequestSchema = z.object({
  courseSlug: z.string(),
  courseVersion: z.number(),
  modules: z.array(
    z.object({
      id: z.number().optional(),
      title: z.string(),
      order: z.number(),
      lessons: z.array(
        z.object({
          id: z.number().optional(),
          title: z.string(),
          isExtraTraining: z.boolean(),
          order: z.number(),
        }),
      ),
      milestones: z.array(
        z.object({
          id: z.number().optional(),
          order: z.number(),
        }),
      ),
    }),
  ),
});

export type TSaveCourseStructureRequest = z.infer<typeof SaveCourseStructureRequestSchema>;

export const SaveCourseStructureSuccessResponseSchema = GetCourseStructureSuccessResponseSchema;

export type TSaveCourseStructureSuccessResponse = z.infer<typeof SaveCourseStructureSuccessResponseSchema>;

const SaveCourseStructureUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  ConflictError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ConflictError',
    schema: z.object({
      trace: z.string().optional(),
      courseVersion: z.number(),
    }),
  }),
});
export type TSaveCourseStructureUseCaseErrorResponse = z.infer<typeof SaveCourseStructureUseCaseErrorResponseSchema>;

export const SaveCourseStructureUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveCourseStructureSuccessResponseSchema,
  SaveCourseStructureUseCaseErrorResponseSchema,
]);

export type TSaveCourseStructureUseCaseResponse = z.infer<typeof SaveCourseStructureUseCaseResponseSchema>;
