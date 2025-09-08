import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListStudentNotesRequestSchema = z.object({
    courseSlug: z.string(),
});
export type TListStudentNotesRequest = z.infer<typeof ListStudentNotesRequestSchema>;

export const ListStudentNotesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    modules: z.array(z.object({
        id: z.string(),
        position: z.number(),
        title: z.string(),
        lessons: z.array(z.object({
            id: z.string(),
            position: z.number(),
            title: z.string(),
            notes: z.string()  // rich text
        })),
    }))
}));
export type TListStudentNotesSuccessResponse = z.infer<typeof ListStudentNotesSuccessResponseSchema>;

const ListStudentNotesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListStudentNotesUseCaseErrorResponse = z.infer<typeof ListStudentNotesUseCaseErrorResponseSchema>;

export const ListStudentNotesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListStudentNotesSuccessResponseSchema,
    ListStudentNotesUseCaseErrorResponseSchema,
]);
export type TListStudentNotesUseCaseResponse = z.infer<typeof ListStudentNotesUseCaseResponseSchema>;