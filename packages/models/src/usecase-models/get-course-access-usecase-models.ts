import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetCourseAccessRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetCourseAccessRequest = z.infer<typeof GetCourseAccessRequestSchema>;

export const GetCourseAccessSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  roles: z.array(z.enum(['visitor', 'student', 'coach', 'admin'])),
  isAssessmentCompleted: z.boolean().nullable(),
}));

export type TGetCourseAccessSuccessResponse = z.infer<typeof GetCourseAccessSuccessResponseSchema>;

const GetCourseAccessUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  ForbiddenError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ForbiddenError',
    schema: z.object({
        trace: z.string().optional(),
    }),
  }),
});
export type TGetCourseAccessUseCaseErrorResponse = z.infer<typeof GetCourseAccessUseCaseErrorResponseSchema>;

export const GetCourseAccessUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetCourseAccessSuccessResponseSchema,
  GetCourseAccessUseCaseErrorResponseSchema,
]);

export type TGetCourseAccessUseCaseResponse = z.infer<typeof GetCourseAccessUseCaseResponseSchema>;
