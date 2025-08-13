import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const CreateCourseRequestSchema = z.object({
  duplicateCourseid: z.number().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  imageFileId: z.string(),
});

export type TCreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;

export const CreateCourseSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TCreateCourseSuccessResponse = z.infer<typeof CreateCourseSuccessResponseSchema>;

const CreateCourseUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TCreateCourseUseCaseErrorResponse = z.infer<typeof CreateCourseUseCaseErrorResponseSchema>;

export const CreateCourseUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  CreateCourseSuccessResponseSchema,
  CreateCourseUseCaseErrorResponseSchema,
]);

export type TCreateCourseUseCaseResponse = z.infer<typeof CreateCourseUseCaseResponseSchema>;
