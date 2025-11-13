import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BasePartialSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
    CommonErrorSchemaMap
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';
import {
    CourseStatusSchema,
} from '@dream-aim-deliver/e-class-cms-rest';

export const ListUserCoursesRequestSchema = DefaultPaginationSchema.extend({
    userId: z.number().optional().nullable(),
});
export type TListUserCoursesRequest = z.infer<typeof ListUserCoursesRequestSchema>;

const BaseCourseSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    status: CourseStatusSchema,
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
    coachingSessionCount: z.number().optional().nullable(),
    salesCount: z.number(),
    fullDuration: z.number(),
    createdAt: z.string().datetime({ offset: true }),
});

const StudentCourseSchema = BaseCourseSchema.extend({
    role: z.literal('student'),
    progress: z.number(),
});

const CoachCourseSchema = BaseCourseSchema.extend({
    role: z.enum(['coach']),
});

const OwnerAdminCourseSchema = BaseCourseSchema.extend({
    role: z.enum(['course_creator', 'admin', 'superadmin']),
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

export const ListUserCoursesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListUserCoursesUseCaseErrorResponse = z.infer<typeof ListUserCoursesUseCaseErrorResponseSchema>;

// TODO: Update factory to support discriminated unions
export const ListUserCoursesUseCasePartialResponseSchema = BasePartialSchemaFactory(
    // @ts-expect-error The factory expects only ZodRawShape, while discriminated union is not supported
    CourseSchema,
    CommonErrorSchemaMap
)
export type TListUserCoursesUseCasePartialResponse = z.infer<typeof ListUserCoursesUseCasePartialResponseSchema>;


export const ListUserCoursesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListUserCoursesSuccessResponseSchema,
    ListUserCoursesUseCaseErrorResponseSchema,
    ListUserCoursesUseCasePartialResponseSchema,
]);

export type TListUserCoursesUseCaseResponse = z.infer<typeof ListUserCoursesUseCaseResponseSchema>;