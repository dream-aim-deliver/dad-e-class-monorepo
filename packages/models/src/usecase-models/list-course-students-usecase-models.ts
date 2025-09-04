import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { AssignmentStatusEnumSchema } from '../assignment';


export const ListCourseStudentsRequestSchema = z.object({
    courseSlugs: z.array(z.string()).optional().nullable(),
});
export type TListCourseStudentsRequest = z.infer<typeof ListCourseStudentsRequestSchema>;

export const ListCourseStudentsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    students: z.array(z.object({
        studentId: z.number(),
        fullName: z.string(),
        avatarUrl: z.string().nullable(),
        courseTitle: z.string(),
        courseSlug: z.string(),
        courseImageUrl: z.string().nullable(),
        isStudentOfCoach: z.boolean(),
        lastAssignmentCoach: z.object({
            coachId: z.number(),
            coachFullName: z.string().nullable(),
            coachingSessionCount: z.number(),
            avatarUrl: z.string().nullable(),
        }),
        lastAssignment: z.object({
            assignmentId: z.string(),
            assignmentTile: z.string(),
            assignmentStatus: AssignmentStatusEnumSchema
        }),
    }))
}));
export type TListCourseStudentsSuccessResponse = z.infer<typeof ListCourseStudentsSuccessResponseSchema>;

const ListCourseStudentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCourseStudentsUseCaseErrorResponse = z.infer<typeof ListCourseStudentsUseCaseErrorResponseSchema>;

export const ListCourseStudentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCourseStudentsSuccessResponseSchema,
    ListCourseStudentsUseCaseErrorResponseSchema,
]);
export type TListCourseStudentsUseCaseResponse = z.infer<typeof ListCourseStudentsUseCaseResponseSchema>;