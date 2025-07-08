import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetEnrolledCourseDetailsRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetEnrolledCourseDetailsRequest = z.infer<typeof GetEnrolledCourseDetailsRequestSchema>;

export const GetEnrolledCourseDetailsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  title: z.string(),
  imageUrl: z.string().nullable(),
  avatarRating: z.number(),
  reviewCount: z.number().int(),
  description: z.string(),
  duration: z.object({
    // Minutes
    video: z.number().int().min(0),
    coaching: z.number().int().min(0),
    selfStudy: z.number().int().min(0),
  }),
  author: z.object({
    username: z.string(),
    name: z.string(),
    surname: z.string(),
    averageRating: z.number(),
    avatarUrl: z.string().nullable()
  }),
  students: z.array(z.object({
    name: z.string(),
    avatarUrl: z.string().nullable()
  })),
  studentCount: z.number().int()
}));

export type TGetEnrolledCourseDetailsSuccessResponse = z.infer<typeof GetEnrolledCourseDetailsSuccessResponseSchema>;

const GetEnrolledCourseDetailsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  // TODO: remove when this error is included in the SDK by default
  ForbiddenError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ForbiddenError',
    schema: z.object({
        trace: z.string().optional(),
    }),
  }),
});
export type TGetEnrolledCourseDetailsUseCaseErrorResponse = z.infer<typeof GetEnrolledCourseDetailsUseCaseErrorResponseSchema>;

export const GetEnrolledCourseDetailsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetEnrolledCourseDetailsSuccessResponseSchema,
  GetEnrolledCourseDetailsUseCaseErrorResponseSchema,
]);

export type TGetEnrolledCourseDetailsUseCaseResponse = z.infer<typeof GetEnrolledCourseDetailsUseCaseResponseSchema>;
