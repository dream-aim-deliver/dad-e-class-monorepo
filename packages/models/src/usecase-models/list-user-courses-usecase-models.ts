import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListUserCoursesRequestSchema = DefaultPaginationSchema.extend({
  userId: z.number().optional(),
});
export type TListUserCoursesRequest = z.infer<typeof ListUserCoursesRequestSchema>;

export const CourseStateSchema = z.enum(['draft', 'review', 'live']);
export type TCourseState = z.infer<typeof CourseStateSchema>;

const BaseCourseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  state: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  averageRating: z.number(),
  reviewCount: z.number(),
  author: z.object({
    name: z.string(),
    surname: z.string(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  language: z.string(),
  coachingSessionCount: z.number().optional(),
  salesCount: z.number(),
  fullDuration: z.number(),
});

const StudentCourseSchema = BaseCourseSchema.extend({
  role: z.literal('student'),
  progress: z.number(),
});

const CoachCourseSchema = BaseCourseSchema.extend({
  role: z.enum(['coach']),
});

const OwnerAdminCourseSchema = BaseCourseSchema.extend({
  role: z.enum(['owner', 'admin']),
  state: CourseStateSchema,
});

const CourseSchema = z.discriminatedUnion('role', [
  StudentCourseSchema,
  CoachCourseSchema,
  OwnerAdminCourseSchema,
]);

export const ListUserCoursesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  courses: CourseSchema.array(),
}));

export type TListUserCoursesSuccessResponse = z.infer<typeof ListUserCoursesSuccessResponseSchema>;

const ListUserCoursesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListUserCoursesUseCaseErrorResponse = z.infer<typeof ListUserCoursesUseCaseErrorResponseSchema>;

export const ListUserCoursesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListUserCoursesSuccessResponseSchema,
  ListUserCoursesUseCaseErrorResponseSchema,
]);

export type TListUserCoursesUseCaseResponse = z.infer<typeof ListUserCoursesUseCaseResponseSchema>;
