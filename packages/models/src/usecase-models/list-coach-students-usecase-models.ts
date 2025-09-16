import { z } from "zod";
import { DefaultPaginationSchema } from "../utils/pagination";
import { CourseAssignmentStatusEnumSchema } from './common';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';



export const ListCoachStudentsRequestSchema = DefaultPaginationSchema.extend({});
export type TListCoachStudentsRequest = z.infer<typeof ListCoachStudentsRequestSchema>;


export const ListCoachStudentsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    students: z.array(z.object({
        studentId: z.number(),
        fullName: z.string(),
        avatarUrl: z.string().nullable(),
        coachingSessionCount: z.number(),
        courses: z.array(z.object({
            courseTitle: z.string(),
            courseSlug: z.string(),
            courseImageUrl: z.string().nullable(),
            courseCompletionDate: z.string().datetime({ offset: true }).nullable(),
            lastAssignment: z.object({
                assignmentId: z.string(),
                assignmentTitle: z.string(),
                assignmentStatus: CourseAssignmentStatusEnumSchema
            }).optional().nullable(),
        }))
    })),
}));
export type TListCoachStudentsSuccessResponse = z.infer<typeof ListCoachStudentsSuccessResponseSchema>;

const ListCoachStudentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCoachStudentsUseCaseErrorResponse = z.infer<typeof ListCoachStudentsUseCaseErrorResponseSchema>;

export const ListCoachStudentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCoachStudentsSuccessResponseSchema,
    ListCoachStudentsUseCaseErrorResponseSchema,
]);
export type TListCoachStudentsUseCaseResponse = z.infer<typeof ListCoachStudentsUseCaseResponseSchema>;