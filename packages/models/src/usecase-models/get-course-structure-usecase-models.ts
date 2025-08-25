import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCourseStructureRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetCourseStructureRequest = z.infer<typeof GetCourseStructureRequestSchema>;

export const GetCourseStructureSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  courseVersion: z.number(),
  modules: z.array(z.object({
    id: z.number(),
    title: z.string(),
    position: z.number(),
    lessons: z.array(z.object({
      id: z.number(),
      title: z.string(),
      position: z.number(),
      extraTraining: z.boolean(),
    })),
    milestones: z.array(z.object({
      id: z.number(),
      precedingLessonId: z.number(),
    })),
  }))
}));

export type TGetCourseStructureSuccessResponse = z.infer<typeof GetCourseStructureSuccessResponseSchema>;

const GetCourseStructureUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCourseStructureUseCaseErrorResponse = z.infer<typeof GetCourseStructureUseCaseErrorResponseSchema>;

export const GetCourseStructureUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCourseStructureSuccessResponseSchema,
  GetCourseStructureUseCaseErrorResponseSchema,
]);

export type TGetCourseStructureUseCaseResponse = z.infer<typeof GetCourseStructureUseCaseResponseSchema>;
