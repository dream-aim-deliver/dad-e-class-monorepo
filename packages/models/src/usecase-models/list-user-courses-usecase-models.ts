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
  languages: z.array(z.string()),
  coachingSessionCount: z.number().optional(),
  salesCount: z.number(),
  fullDuration: z.number(),
});

const StudentCoachCourseSchema = BaseCourseSchema.extend({
  role: z.enum(['student', 'coach']),
});

const OwnerAdminCourseSchema = BaseCourseSchema.extend({
  role: z.enum(['owner', 'admin']),
  state: CourseStateSchema,
});

const CourseSchema = z.discriminatedUnion('role', [
  StudentCoachCourseSchema,
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
