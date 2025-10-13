import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetStudentDetailsRequestSchema = z.object({
    username: z.string(),
});
export type TGetStudentDetailsRequest = z.infer<typeof GetStudentDetailsRequestSchema>;

export const GetStudentDetailsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    username: z.string(),
    avatarImage: z.object({
        id: z.string(),
        name: z.string(),
        size: z.number(),
        category: z.literal("image"),
        downloadUrl: z.string(),
    }).nullable().optional(),
}));

export type TGetStudentDetailsSuccessResponse = z.infer<typeof GetStudentDetailsSuccessResponseSchema>;

const GetStudentDetailsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetStudentDetailsUseCaseErrorResponse = z.infer<typeof GetStudentDetailsUseCaseErrorResponseSchema>;

export const GetStudentDetailsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetStudentDetailsSuccessResponseSchema,
    GetStudentDetailsUseCaseErrorResponseSchema,
]);
export type TGetStudentDetailsUseCaseResponse = z.infer<typeof GetStudentDetailsUseCaseResponseSchema>;
