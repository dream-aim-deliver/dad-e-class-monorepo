import { z } from 'zod';

// TODO: Replace with actual schema from @dream-aim-deliver/e-class-cms-rest when backend is ready
export const ListCourseGroupsRequestSchema = z.object({
    courseSlug: z.string(),
});

export const GroupSchema = z.object({
    groupId: z.string(),
    groupName: z.string(),
    currentStudents: z.number(),
    totalStudents: z.number(),
    course: z.object({
        image: z.string(),
        title: z.string(),
        slug: z.string(),
    }),
    coach: z.object({
        name: z.string(),
        isCurrentUser: z.boolean(),
    }).optional(),
    creator: z.object({
        name: z.string(),
        image: z.string(),
    }).optional(),
});

export const ListCourseGroupsSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
        groups: z.array(GroupSchema),
    }),
    message: z.string(),
});

export const ListCourseGroupsErrorResponseSchema = z.object({
    success: z.literal(false),
    data: z.object({
        message: z.string(),
        context: z.record(z.any()).optional(),
    }),
});

export const ListCourseGroupsResponseSchema = z.union([
    ListCourseGroupsSuccessResponseSchema,
    ListCourseGroupsErrorResponseSchema,
]);

export type TListCourseGroupsRequest = z.infer<typeof ListCourseGroupsRequestSchema>;
export type TListCourseGroupsSuccessResponse = z.infer<typeof ListCourseGroupsSuccessResponseSchema>;
export type TListCourseGroupsErrorResponse = z.infer<typeof ListCourseGroupsErrorResponseSchema>;
export type TListCourseGroupsResponse = z.infer<typeof ListCourseGroupsResponseSchema>;